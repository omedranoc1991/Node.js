const fs = require('fs') // file system
const http = require('http') // to create a server
const url = require('url') // to look at the url

const json = fs.readFileSync(`${__dirname}/data/data.json`, 'utf-8') // to read files

const laptopData = JSON.parse(json) // to convert json files to js object

const server = http.createServer((req, res) =>{  // to create a server
    
    const pathName = url.parse(req.url, true).pathname  //to extrac the pathname of the req object
    const id = url.parse(req.url, true).query.id  //to extrac the id of the req object


    //Products overview
    if(pathName === "/products" || pathName === '/'){
        res.writeHead(200,{'Content-type':'text/html'}) //we use this to write a header 200 mean all ok , 404 there is a error, 
        
        // to send a response to the browser
        fs.readFile(`${__dirname}/templates/template-overview.html`, 'utf-8', (err,data) =>{
            let overviewOutput = data
            fs.readFile(`${__dirname}/templates/templates-card.html`, 'utf-8', (err,data) =>{
            
                const cardsOutput = laptopData.map(el => replaceTemplate(data, el)).join('')
                overviewOutput = overviewOutput.replace('{%CARDS%}', cardsOutput)
                res.end(overviewOutput)

                })           
           
            })           

    }
    //Laptop detail
    else if(pathName === "/laptop" && id < laptopData.length){
        res.writeHead(200,{'Content-type':'text/html'}) //we use this to write a header 200 mean all ok , 404 there is a error, 
        
        fs.readFile(`${__dirname}/templates/template-laptop.html`, 'utf-8', (err,data) =>{
            
            const laptop = laptopData[id]
            const output = replaceTemplate(data,laptop)
            res.end(output)
            })           

        } 
     //Images
     else if((/\.(jpg|jpeg|png|gif)$/i).test(pathName)){
        fs.readFile(`${__dirname}/data/img${pathName}`, (err, data) => {
            res.writeHead(200,{'Content-type':'image/jpg'}) 
            res.end(data)
        })
     }  
    //URL not found     
    else{
        res.writeHead(404,{'Content-type':'text/html'}) //we use this to write a header 200 mean all ok , 404 there is a error, 
        res.end("URL was not found on the server")  // to send a response to the browser
    }
    
})   


server.listen(1337, '127.0.0.1', () =>{   // to add a port and a ip
    console.log('Listening for requests now')
})

function replaceTemplate(originalHTML, laptop){

    let output = originalHTML.replace(/{%PRODUCTNAME%}/g,laptop.productName)
    output = output.replace(/{%IMAGE%}/g,laptop.image)
    output = output.replace(/{%PRICE%}/g,laptop.price)
    output = output.replace(/{%SCREEN%}/g,laptop.screen)
    output = output.replace(/{%CPU%}/g,laptop.cpu)
    output = output.replace(/{%STORAGE%}/g,laptop.storage)
    output = output.replace(/{%RAM%}/g,laptop.ram)
    output = output.replace(/{%DESCRIPTION%}/g,laptop.description)
    output = output.replace(/{%ID%}/g,laptop.id)

    return output
}