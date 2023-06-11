//首页时间转化
export default {
    //首页时间转化
    dateTime(d){
        let old = new Date(d)
        let now = new Date()
        //获取old的具体时间
        let t = old.getTime()
        let h = old.getHours()
        let m = old.getMinutes()
        let Y = old.getFullYear()
        let M = old.getMonth()
        let D = old.getDay()

        //获取now的具体时间
        let nt = now.getTime()
        let nh = now.getHours()
        let nm = now.getMinutes()
        let nY = now.getFullYear()
        let nM = now.getMonth()
        let nD = now.getDay()

        if(D ===nD && M === nM &&Y === nY){
            //在同一年月日
            if(h<10){
                h = '0'+h
            }
            if(m<10){
                m = '0'+m
            }
        }
        return h+':'+m
    }
}
