var models = require('../models/models.js');

// GET /quizes/question
exports.show = function(req, res){
	models.Quiz.findById(req.params.quizId).then(function (quiz) {
		res.render('quizes/show.ejs', {quiz: quiz, errors: []});
	});
};

// GET /quizes/answer
exports.answer = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function (quiz) {
		if(req.query.respuesta === quiz.respuesta)
			res.render('quizes/answer', {respuesta: 'Correcto', errors: []});
		else
			res.render('quizes/answer', {respuesta: 'Incorrecto', errors: []});
	});
};

exports.index = function(req, res){
	if(req.query.search!=""){
         var info=(req.query.search||"").replace(" ","%");
     }else{info="";}
	models.Quiz.findAll({where: ["pregunta like ?",'%'+info+'%'],order:'pregunta ASC'}).then(function (quizes) {
		res.render('quizes/index.ejs', {quizes: quizes, errors: []});
	});
};

exports.new = function(req, res){
	var quiz = models.Quiz.build(
		{pregunta: "Pregunta", respuesta: "Respuesta"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

exports.create = function(req, res){
	var quiz = models.Quiz.build(
		req.body.quiz
	);
	
	quiz.validate().then(function (err) {
		if(err){
			res.render("quizes/new", {quiz: quiz, errors: err.errors});
		}else{
			quiz.save({fields: ["pregunta", "respuesta"]}).then(function () {
				res.redirect("/quizes");
			});
		}
	})
};