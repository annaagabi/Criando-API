const router = require('express').Router()
const Person = require('../models/persons')

// rotas da API

// Create - criação de dados
router.post('/', async (req, res) => { // é um post - envia dados

    // req.body - corpo de requisição
    // Extrai todas as variaveis - name, salary, approved
    // Possui os atributos - name, salary, approved
    const {name, salary, approved } = req.body

    // validação pra ver se o main foi enviado
    if(!name){ // se não tem nome no body
        // 422 é utilizado para erros eventuais do sistema
        res.status(422).json({error: 'O nome é obrigatório!'})
    }
   
    // Passa todos os atributos para uma 
    const person = {
        name,
        salary,
        approved
    }

    // create - cria dados para mim no sistema

    // try e catch tentam resgatar os erros que podem acontecer
    try{
        // criando dados
        await Person.create(person)

        // recurso criado com sucesso
        res.status(201).json({message: 'Pessoa inserida no sistema com sucesso'})

    } catch(error){
        res.status(500).json({error: error})
    }
})

// Read - Leitura de dados
router.get('/', async(req, res) =>{
    try{
        const people = await Person.find()

        // status 200: a requisição foi realizada com sucesso
        res.status(200).json(people)

    }catch(error){
        res.status(500).json({error: error})
    }
})

// rotas dinâmicas
router.get('/:id', async(req, res) => {

    // console.log(req)
    // extrair o dado da requisição, pela  url = req.params
    const id = req.params.id

    try{
        const person = await Person.findOne({_id: id})

        if(!person){
            res.status(422).json({message: 'O usuário não foi encontrado'})
            return // não executa mais nenhuma linha
        }

        res.status(200).json(person)

    }catch(error){
        res.status(500).json({error: error})
    }
})

// Updadte - atualização de dados (PUT, PATCH)
// PUT - espera que mandemos um objeto completo para realizar a atualização de registro do sistema
// PATCH - Atualização parcial
router.patch('/:id', async (req, res) =>{

    //a url vai vir com o id do usuario
    const id = req.params.id

    // o corpo vai vir com os dados que precisam ser atualizados
    const {name, salary, approved} = req.body

    const person = {
        name,
        salary,
        approved,
    }

    try{
        const updatedPerson = await Person.updateOne({_id: id}, person)

        //se a api conseguiu atualizar alguem


        // console.log(updatedPerson)

        // se não atualizou ninguém
        if(updatedPerson.matchedCount === 0){ // validação de existencia de usuario
            res.status(422).json({message: 'O usuário não foi encontrado'})
            return 
        }

        res.status(200).json(person)

    } catch(error){
        res.status(500).json({error: error})
    }
})

// Delete - deletar dados

router.delete('/:id', async (req, res) =>{
    const id = req.params.id

    const person = await Person.findOne({_id: id})

    if(!person){
        res.status(422).json({ message: 'O usuário não foi encontrado' })
        return // não executa mais nenhuma linha
    }

    try{
        await Person.deleteOne({_id: id})
        res.status(200).json({ message:'Usuário removido com sucesso'})

    } catch(error){
        res.status(500).json({error: error})
    }
})


module.exports = router