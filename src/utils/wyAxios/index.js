import { message } from 'antd'
import axios from 'axios'
const wyAxiosPost = function(url,data,callback){
    const genData = data 
    genData.user_id = "123"
    axios.post("http://localhost:5000/"+url,{param:genData}).then(function(response){
        const {status, data} = response
        if(status === 200){
            callback(data)
            return
        }
        message.warning("请求出错")
        
    }).catch(function(error){
        console.log("系统错误",error)
    })
}
export {wyAxiosPost}