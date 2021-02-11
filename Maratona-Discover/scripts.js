const Modal = {
    open(){
        //Abrir Modal
        //Aducionar a class acitve ao Modal
        document.querySelector('.modal-overlay')
        .classList.add('active')
    },
    close(){
        //Fechar Modal
        //remover a class active ao modal
        document.querySelector('.modal-overlay')
        .classList.remove('active')
    }
}

const Storage = {
    get(){
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },

    set(transactions){
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: [
        { 
        description: 'Luz',
        amount: -20001,
        date: '10/02/2021'
        },
        { 
        description: 'Desenvolvimento WebSite',
        amount: 100000,
        date: '03/02/2021'
        },
        { 
        description: 'Internet',
        amount: -12000,
        date: '01/02/2021'
        },
        { 
        description: 'App',
        amount: 200000,
        date: '01/02/2021'
        }], 
    add(transaction){
        Transaction.all.push(transaction)

        App.reload()
    },

    remove(index){
        Transaction.all.splice(index, 1)

        App.reload()
    },

    incomes() {
        let income = 0;
        //pegar todas as Transações
        Transaction.all.forEach(transaction => { //para cada transação,
            if (transaction.amount > 0 ) { //se o valor for maior que 0
                income += transaction.amount; //soma o valor com o valor que já existe
            }
        })
        return income;
    },

    expanses(){
        let expanse = 0;
        Transaction.all.forEach(transaction => {
            if (transaction.amount < 0 ) {
                expanse += transaction.amount;
            }
        })
        return expanse;
    },

    total(){
        return Transaction.incomes() + Transaction.expanses();
    }
}

const DOM = {
    transactionsContainer: document.querySelector('#data-table tbody'),
    addTransaction(transaction, index){
        const tr = document.createElement('tr')
        tr.innerHTML = DOM.innerHTMLTransaction(transaction, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction, index){

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" alt="Remover Transação">
            </td>
        `

        return html
    },
    
    updateBalance(){
        document
        .getElementById('income-display')
        .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
        .getElementById('expanse-display')
        .innerHTML = Utils.formatCurrency(Transaction.expanses())
        document
        .getElementById('total-display')
        .innerHTML = Utils.formatCurrency(Transaction.total())
    },

    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatAmount(value){
        value = Number(value) * 100
        
        return value
    },

    formatDate(date){
        {
            const splittedDate = date.split("-")
            return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
        }
    },

    formatCurrency(value){
        const signal = Number(value) < 0 ? "-" : ""

        value = String(value).replace(/\D/g,"")
        value = Number(value)/100

        value = value.toLocaleString("pt-br",{
            style: "currency",
            currency: "BRL"
        })

        return signal + value
    }
}

const Form = {
    description: document.querySelector('input#description'),
    amount: document.querySelector('input#amount'),
    date: document.querySelector('input#date'),

    getValues(){
        return{
        description: Form.description.value,
        amount: Form.amount.value,
        date: Form.date.value
        }
    },

    formatValues (){
        let {description, amount, date} = Form.getValues()

        amount = Utils.formatAmount(amount)
        date = Utils.formatDate(date)
        
        return{
            description,
            amount,
            date
        }
    },

    validateField(){
        const {description, amount, date} = Form.getValues()
        
        if( description.trim === "" || 
        amount.trim === "" ||
        date.trim === ""){
            throw new Error("Por favor preencha todos os campos")
        }
    },

    clearFields(){
        Form.description.value = ""
        Form.amount.value = ""
        Form.date.value = ""
    },

    submit(event){
        event.preventDefault()

        try {
            //verificar se todas as informações foram preenchidas
            Form.validateField()

            //formatar os dados para salvar
            const transaction = Form.formatValues()

            //salvar
            Transaction.add(transaction)
            
            //apagar todos os dados do formulário
            Form.clearFields()
            
            //modal feche
            Modal.close()
            
            //Atualizar a Aplicação
            // App.reload()

        } catch (error) {
            alert(error.message)
        }
    },
}

const App = {
    init(){
        Transaction.all.forEach(DOM.addTransaction)
        
        DOM.updateBalance()

    },
    reload(){
        DOM.clearTransactions()
        App.init()
    },
}

App.init()

// Transaction.remove(0)
