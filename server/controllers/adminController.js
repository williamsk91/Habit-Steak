module.exports = (app)=>{

    //landing page
    app.get('/', (req, res)=>{
        res.render('landingPage');
    })

    //feedback page - future implementation
    // app.get('/feedback', (req, res)=>{
    //     res.render('feedback');
    // })

}