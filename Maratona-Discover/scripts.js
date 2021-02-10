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

const transactions = [
    { 
        id: 1,
        description: 'Luz',
        amount: -20001,
        date: '10/02/2021'
    },
    { 
        id: 2,
        description: 'Desenvolvimento WebSite',
        amount: 100000,
        date: '03/02/2021'
    },
    { 
        id: 3,
        description: 'Internet',
        amount: -12000,
        date: '01/02/2021'
    },
    { 
        id: 4,
        description: 'App',
        amount: 200000,
        date: '01/02/2021'
    }
]

const Transaction = {
    all: transactions, 
    add(transaction){
        Transaction.all.push(transaction)

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
        tr.innerHTML = DOM.innerHTMLTransaction(transaction)

        DOM.transactionsContainer.appendChild(tr)
    },

    innerHTMLTransaction(transaction){

        const CSSclass = transaction.amount > 0 ? "income" : "expense"

        const amount = Utils.formatCurrency(transaction.amount)

        const html = `
            <td class="description">${transaction.description}</td>
            <td class="${CSSclass}">${amount}</td>
            <td class="date">${transaction.date}</td>
            <td>
                <img src="./assets/minus.svg" alt="Remover Transação">
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

const App = {
    init(){
        Transaction.all.forEach(transaction => {
            DOM.addTransaction(transaction)
        })
        
        DOM.updateBalance()

    },
    reload(){
        DOM.clearTransactions()
        App.init()
    },
}

App.init()



Transaction.add({
    id: 39,
    description: 'Alo',
    amount: 200,
    date: '23/02/2021'
})
