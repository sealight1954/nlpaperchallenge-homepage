const fs = require('fs-extra')
const axios = require('axios')
const readXlsxFile = require('read-excel-file/node')

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
  // "emnlp2019": "https://script.google.com/macros/s/AKfycbzhiH6N938vsgap6CsosVNNMRmJBmqCyVjW0d5LPzioVkhF_kRd/exec?entity=summaries",
  // "acl2020": "https://script.google.com/macros/s/AKfycbyhaHccUOB1QorYZgwDyxC0be-22-3Nv0IyCrqgzLalCLH_o27G/exec?entity=summaries",
}

// https://stackoverflow.com/questions/16229494/converting-excel-date-serial-number-to-date-using-javascript
function ExcelDateToJSDate(date) {
  return new Date(Math.round((date - 25569)*86400*1000));
}

const map_func = {
  identical: x => x,
  val2date: x => ExcelDateToJSDate(x),
  splitBySemicolon: x => x.split(';').filter(val => val != ''),
  splitByComma: x => x.split(',').filter(val => val != ''),
  nullThenDefaultImage: x => (x == null ? "image.png" : x)
}

const key_to_excel_idx = {
  id: 0, // 数値で解釈すること
  date: 2, // ただし日付変換すること
  paper_id: 0, // 数値で解釈すること
  resumer: 4,
  overview: 6,
  details: 7,
  results: 8,
  tags: 9, // ただし;区切りでlistに
  comment: 10,
  title: 5,
  authors: 12, // カンマ区切りでlistに
  link: 11,
  image: 13 // nullならば特定の画像に置き換え
}
// TODO: 以下はread-excel-fileのSCHEMAで書ける？splitとか、nullThenが書きづらい？
const key_to_map = {
  id: map_func["identical"],
  date: map_func["val2date"],
  paper_id: map_func["identical"],
  resumer: map_func["identical"],
  overview: map_func["identical"],
  details: map_func["identical"],
  results: map_func["identical"],
  tags: map_func["splitBySemicolon"],
  comment: map_func["identical"],
  title: map_func["identical"],
  authors: map_func["splitByComma"],
  link: map_func["identical"],
  image: map_func["nullThenDefaultImage"],
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
  ///   https://stackoverflow.com/questions/26454655/convert-javascript-array-of-2-element-arrays-into-object-key-value-pairs
  function objectify(array) {
    return array.reduce(function(p, c) {
        p[c[0]] = c[1];
        return p;
    }, {});
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
    fetch_mode = "Local_Excel"
    // fetch_mode = "Google_App_Script"
    if (fetch_mode == "Google_App_Script")
    {
      // TODO: soft-code urls[0]-urls[2]
      console.log(`STARTING JSON BUILD FOR ${urls[0]},${urls[1]},${urls[2]}...`)
      
      // Fetch list of events, members, and resources from API
      var allEvents = await axios.get(urls[0])
      var allMembers = await axios.get(urls[1])
      var allResources = await axios.get(urls[2])

      // Fetch confKeys and confSummaries
      var confKeys = Object.keys(conferenceUrls)
      // Fetch conference summaries
      var confSummaries = {}
      for(let key of confKeys) {
        console.log("Downloading from:" + conferenceUrls[key])
        confSummaries[key] = await axios.get(conferenceUrls[key])
      }
    }
    else
    {
      console.log("Load from local Excel.")
      // TODO: 元のCVCHallengeのリソースそのままなので、書き直す必要
      var allEvents = await axios.get(urls[0])
      var allMembers = await axios.get(urls[1])
      var allResources = await axios.get(urls[2])

      // File path.
      var confKeys = ["PaperSurveyTest"]
      var confSummaries = {}
      confSummaries["PaperSurveyTest"] = {data: []}
      await readXlsxFile('static/PaperSurveyTest.xlsx').then(
        rows => {
          confSummaries["PaperSurveyTest"].data =
            rows.filter(
              (e, i) => i > 0
            ).map(
              (row, i) => objectify(Object.keys(key_to_excel_idx).map(
                key => [key, key_to_map[key](row[key_to_excel_idx[key]])]
              ))
            )
        }
      ) // OK
    }
    const fetcher = []


    fetcher.push(writeData('static/data/events.json', { content: allEvents.data }))
    fetcher.push(writeData('static/data/members.json', { content: allMembers.data }))
    fetcher.push(writeData('static/data/resources.json', { content: allResources.data }))

    // Save conference keys
    console.log("conference keys:" + confKeys)
    fetcher.push(writeData('static/data/confKeys.json', { content: confKeys }))


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
