export default{
  plugins:[
      [
          "umi-plugin-react",
          {
              antd:true,
              dva:true
          }
      ]
  ],
  //路由配置
  routes:[
      
      {path:"/login",component:'./login'},
      {
          path:"/",
          component:'../layout/index',
          routes:[
              {path:"/goods",component:'./goods'},
              // {path:"/index",component:'./index'},//路径是相对于props
              {
                  path:"/about",
                  component:'./about',
                  Routes:['./routes/privateRoute.js']//路由守卫配置编写路径相对于根目录，后缀名.js不能省略
              },
              {
                  path:"/users",
                  component:'./users/_layout',
                  routes:[
                      {path:"/users",component:'./users/index'},
                      {path:"/users/:name",component:'./users/$name'},
                  ]
              },
              {component:'./notFound'},
          ]
      },
     
      
  ]
}