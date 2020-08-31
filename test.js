// const { listenerCount } = require("process")
// const { Iteration } = require("Misc/_api")

// var a =[
//     {a:1,b:2},
//     {a:2,b:1},
//     {a:4,b:3},
//     {a:3,b:4}
// ]
// a.sort((a,b) => a)

// console.log()

// console.log(a)
// a.map(item => {
//     item.a.sort
// })


// a.map(item => {
//     item.children.sort((a,b) => a.urlid-b.urlid)
//     return {...item}
// })
// a.sort((a,b) => a.urlid-b.urlid)



// const crypto = require('crypto')

// var content = 'xiaolu'
// var token1 = '62e33584fd4b63c1a364c6c6a02f0f3c2c8418a832a53616e67fb3fdd80b49b2';
// // var buf = crypto.randomBytes(32);
// // token1 = buf.toString('hex')
// var Secrectkey = token1
// console.log('token1: ', token1);
// var signture = crypto.createHmac('sha512',Secrectkey)
// signture.update(content)
// var miwen=signture.digest().toString('base64');//生成的密文后将再次作为明文再通过pbkdf2算法迭代加密；
// // var miwen=signture.digest();//生成的密文后将再次作为明文再通过pbkdf2算法迭代加密；
// console.log("加密的结果f："+miwen);
// // var md5 = crypto.createHash('hash256')
// // md5.update(content)





const crypto = require('crypto')

var a = 'xiaolushuaishuaide'

var key = crypto.randomBytes(64)
var iv = crypto.randomBytes(32)
const algorithm = 'aes-256-gcm'
const cipher = crypto.createCipher(algorithm,key,iv)
let encrypted = cipher.update(a,'utf8','hex')
encrypted += cipher.final('hex')
const tag = cipher.getAuthTag();
console.log('tag: ', tag);



let decipher = crypto.createDecipheriv(algorithm, key, iv); // 初始化解密算法
decipher.setAuthTag(tag); // 传入验证标签，验证密文的来源
let decrypted = decipher.update(encrypted, 'hex', 'utf8');
decrypted += decipher.final('utf8');
console.log('decrypted: ', decrypted);