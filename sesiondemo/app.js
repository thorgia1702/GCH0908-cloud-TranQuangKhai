var express = require('express')
var app = express()
var session = require('express-session')
var MongoClient = require('mongodb').MongoClient
var url = 'mongodb://localhost:27017'

const oneDay = 1000 * 60 * 60 * 24;
app.use(session({
    secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
    saveUninitialized:true,
    cookie: { maxAge: oneDay },
    resave: false 
}));


app.set('view engine', 'hbs')
app.use(express.urlencoded({extended:true}))

app.get('/', (req, res)=>
{
    const session = req.session
    const account = session.account
    res.render('home',{'account': account})
})

app.get('/register', async (req, res)=>{
    res.render('register')
})

app.post('/insertAccount', async (req, res)=>{
    let name = req.body.txtName
    let password = req.body.txtPassword
    let role = req.body.txtRole
    let account = {
        'name' : name,
        'password' : password,
        'role' : role
    }
    console.log(account)
    let client= await MongoClient.connect(url);
    let dbo = client.db("AccountDB");
    await dbo.collection("Acc").insertOne(account)
    res.redirect('/register')
})

app.get('/login', (req, res) => {
    res.render('login')
})

app.post('/loginAccount', async (req, res) => {
    let name = req.body.txtName
    let pass = req.body.txtPassword

    let client= await MongoClient.connect(url);
    let dbo = client.db("AccountDB");
    const account = await dbo.collection("Acc").findOne({'name' :name,'password': pass})
    if(account !=null){
        console.log(`Name : ${account.name} Role: ${account.role}`)
        var session=req.session
        session.account = account
        res.redirect('/')
    }else{
        res.redirect('/login')
    }
})

const PORT = process.env.PORT || 5000
app.listen(PORT)
console.log('Server is running on port')