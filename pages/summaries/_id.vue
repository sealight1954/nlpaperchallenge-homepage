<script>
export default {
  fetch({ redirect, params }) {
    // 古いURLへのアクセスをリダイレクトの設定に
    redirect('301', `/summaries/acl2019/${params.id}`)
  }
}
</script>