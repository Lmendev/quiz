var models = require('../models/models.js');

exports.load = function(req, res, next, quizId){
	models.Quiz.find({
		where: {id: Number(quizId)},
		include: [{model: models.Comment }]
	}).then(function (quiz) {
		if(quiz){
			req.quiz = quiz;
			next();
		}else{
			next(new Error('No existe quizId='+quizId));
		}
	}).catch(function (error) {
		next(error);
	});
};

// GET /quizes/question
exports.show = function(req, res){
	models.Quiz.findById(req.params.quizId).then(function (quiz) {
		res.render('quizes/show.ejs', {quiz: req.quiz, errors: []});
	});
};

// GET /quizes/answer
exports.answer = function(req, res) {
	models.Quiz.findById(req.params.quizId).then(function (quiz) {
		if(req.query.respuesta === req.quiz.respuesta)
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

exports.edit = function(req, res){
	var quiz = req.quiz;

	res.render('quizes/edit', {quiz: quiz, errors: []});
};

exports.update = function(req, res){
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	console.log("asdasd");

	req.quiz
	.validate()
	.then(
		function (err) {
			if(err){
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			}else{
				req.quiz
				.save({fields: ["pregunta", "respuesta"]})
				.then(function () {
					res.redirect('/quizes');
				});
			}
		}
	);

	
};

exports.destroy = function(req, res){
	req.quiz.destroy().then(function () {
		res.redirect('/quizes');
	}).catch(function (error) {
		next(error);
	})
};