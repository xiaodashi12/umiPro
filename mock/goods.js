//因为本地没有数据库，所以现在mock里模拟数据
let data=[
    {
        title:'vue单页面电商项目'
    },
    {
        title:'react单页面后台管理项目'
    }
]
export default {
    //method url 返回的对象，跟我们node编写的express一样
    "get /api/goods":function(req,res){
        setTimeout(()=>{
            res.json({result:data})
        },1000)
    }
}