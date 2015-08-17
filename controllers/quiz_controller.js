var models = require('../models/models.js');

// GET /quizes/question
exports.show = function(req, res){
	models.Quiz.findById(req.params.quizId).then(function (quiz) {
		res.render('quizes/show.ejs', {quiz: quiz});
	});
};

// GET /quizes/answer
exports.answer = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function (quiz) {
		if(req.query.respuesta === quiz.respuesta)
			res.render('quizes/answer', {respuesta: 'Correcto'});
		else
			res.render('quizes/answer', {respuesta: 'Incorrecto'});
	});
};

exports.index = function(req, res){
	if(req.query.search!=""){
         var info=(req.query.search||"").replace(" ","%");
     }else{info="";}
	models.Quiz.findAll({where: ["pregunta like ?",'%'+info+'%'],order:'pregunta ASC'}).then(function (quizes) {
		res.render('quizes/index.ejs', {quizes: quizes});
	});
};