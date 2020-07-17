const fs = require('fs-extra')
const axios = require('axios')

// URL for general information
const GOOGLE_APP_SCRIPT_RESOURCE_URL = 'https://script.google.com/macros/s/AKfycbxmGjl76YSWUtMBrapRFat2KI_qdG3r31Zq6h_H4rNbSPUEA-zh/exec'
const urls = [
  `${GOOGLE_APP_SCRIPT_RESOURCE_URL}?entity=events`,
  `${GOOGLE_APP_SCRIPT_RESOURCE_URL}?entity=members`,
  `${GOOGLE_APP_SCRIPT_RESOURCE_URL}?entity=resources`,
]

// URL for Conferences Summaries
const conferenceUrls = {
  "acl2019": "https://script.google.com/macros/s/AKfycbwrgF6XCx_CEIhsdoHzoNpQX4xku0DK1CytNZxq9CfzxLlsOPyr/exec?entity=summaries",
  "emnlp2019": "https://script.google.com/macros/s/AKfycbzhiH6N938vsgap6CsosVNNMRmJBmqCyVjW0d5LPzioVkhF_kRd/exec?entity=summaries",
  "acl2020": "https://script.google.com/macros/s/AKfycbyhaHccUOB1QorYZgwDyxC0be-22-3Nv0IyCrqgzLalCLH_o27G/exec?entity=summaries",
}



module.exports = function fetchData() {
  //writeData writes the data to a file given the path
  //Same as in previous solution
  const writeData = (path, data) => {
    return new Promise((resolve, reject) => {
      try {
        fs.ensureFileSync(path)
        fs.writeJson(path, data, resolve(`${path} Write Successful`))
      } catch (e) {
        console.error(`${path} Write failed. ${e}`)
        reject(`${path} Write Failed. ${e}`)
      }
    })
  }

  const writeImage = (path, base64encodedData) => {
    return new Promise((resolve, reject) => {
      try {
        fs.ensureFileSync(path)
        fs.writeFile(path, Buffer.from(base64encodedData, 'base64'), resolve(`${path} Write Successful`));
      } catch (e) {
        console.error(`${path} Write failed. ${e}`)
        reject(`${path} Write Failed. ${e}`)
      }
    })
  }

  const normalizeTag = (tag) => {
    return tag.toLowerCase().replace(/\s+/g, '-').replace('#', '')
  }

  const getData = async builder => {
    fs.emptyDirSync('static/data')
    console.log(`STARTING JSON BUILD FOR ${urls[0]},${urls[1]},${urls[2]}...`)
    const fetcher = []

    // Fetch list of events, members, and resources from API
    const allEvents = await axios.get(urls[0])
    const allMembers = await axios.get(urls[1])
    const allResources = await axios.get(urls[2])

    fetcher.push(writeData('static/data/events.json', { content: allEvents.data }))
    fetcher.push(writeData('static/data/members.json', { content: allMembers.data }))
    fetcher.push(writeData('static/data/resources.json', { content: allResources.data }))

    // Save conference keys
    let confKeys = Object.keys(conferenceUrls)
    console.log("conference keys:" + confKeys)
    fetcher.push(writeData('static/data/confKeys.json', { content: confKeys }))

    // Fetch conference summaries
    let confSummaries = {}
    for(let key of confKeys) {
      console.log("Downloading from:" + conferenceUrls[key])
      confSummaries[key] = await axios.get(conferenceUrls[key])
    }

    // Overwrite summary image path with google drive path
    for(let key of confKeys) {
      let summaries = confSummaries[key]
      for(let summary of summaries.data) {
        if (summary['image']) {
          summary['image'] = 'https://drive.google.com/uc?export=view&id=' + summary['image']
        }
      }
    }

    for(let confKey of confKeys) {
      let allSummaries = confSummaries[confKey]

      // Create list data of all summary data of conference
      fs.emptyDirSync(`static/data/summaries/${confKey}`);
      fetcher.push(writeData(`static/data/summaries/${confKey}/all.json`, { content: allSummaries.data }))

      // Create summary per page data
      fs.emptyDirSync(`static/data/summaries/${confKey}/page/`);
      const countPerPage = 5;
      const numPages = Math.ceil(allSummaries.data.length / countPerPage);
      for (let i = 0; i < numPages; i++) {
        let page = i + 1;
        let start = i * countPerPage;
        let end = i * countPerPage + 5;
        let summariesPerPage = allSummaries.data.slice(start, end);
        let pageDataPath = `static/data/summaries/${confKey}/page/${page}/list.json`;

        fetcher.push(writeData(pageDataPath, { content: summariesPerPage, meta: { totalCount: allSummaries.data.length } }));
      }

      // Create summary per tag
      fs.emptyDirSync(`static/data/summaries/${confKey}/tag/`);
      const tagset = new Set(allSummaries.data.reduce((a, b) => [...a, ...b.tags.filter(tag => tag)], []).map(tag => normalizeTag(tag)));

      fetcher.push(writeData(`static/data/summaries/${confKey}/tags.json`, { content: Array.from(tagset) }));

      for (let tag of tagset) {
        let summariesByTag = allSummaries.data.filter(summary => summary.tags.filter(tag => tag).map(tag => normalizeTag(tag)).includes(tag));
        let tagDataPath = `static/data/summaries/${confKey}/tag/${tag}/list.json`;

        fetcher.push(writeData(tagDataPath, { content: summariesByTag, meta: { totalCount: summariesByTag.length } }));
      }

      // Save Summary per Id
      fs.emptyDirSync(`static/data/summaries/${confKey}/id`);
      for (let summary of allSummaries.data) {
        let summaryPath = `static/data/summaries/${confKey}/id/${summary.id}.json`;

        fetcher.push(writeData(summaryPath, { content: summary, meta: { totalCount: allSummaries.data.length } }));
      }

      console.log(`PROCESSING events, members, resources, and summaries...`)
    }

    return Promise.all(fetcher)
      .then(() => {
        console.log('JSON Build complete!')
      })
      .catch(e => {
        throw e
      })
  }

  // Run it before the nuxt build stage
  this.nuxt.hook('build:before', getData)
}
