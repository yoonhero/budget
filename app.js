const money_text = document.querySelector(".all_money");

const income_tab = document.querySelector(".tab1");
const outcome_tab = document.querySelector(".tab2");

const title_input = document.querySelector(".title_input");
const money_input = document.querySelector(".money_input");
const btn = document.querySelector(".btn");

const incomeText = document.querySelector(".incomeText");
const outcomeText = document.querySelector(".outcomeText");

const list = document.querySelector(".list");

let liObject = [];
let income_money = 0;
let outcome_money = 0;
let money = 0;
const MONEY_LS = "Money";
const LIST_LS = "list";
const INCOME_LS = "INCOME";
const OUTCOME_LS = "OUTCOME";
let mode = "outcome";
income_tab.addEventListener("click", () => {
    outcome_tab.classList.remove("activate");
    income_tab.classList.add("activate");
    mode = "income";
});
outcome_tab.addEventListener("click", () => {
    outcome_tab.classList.add("activate");
    income_tab.classList.remove("activate");
    mode = "outcome";
});

function saveList() {
    localStorage.setItem(LIST_LS, JSON.stringify(liObject));
    localStorage.setItem(MONEY_LS, String(money));
    localStorage.setItem(INCOME_LS, String(income_money));
    localStorage.setItem(OUTCOME_LS, String(outcome_money));
}

function deleteList(event) {
    const btn = event.target;
    const deletedLi = btn.parentNode;
    money -= Math.floor(deletedLi.querySelector(".li_money").innerText);
    if (Math.floor(deletedLi.querySelector(".li_money").innerText) > 0) {
        income_money -= Math.floor(
            deletedLi.querySelector(".li_money").innerText
        );
    } else {
        outcome_money += Math.floor(
            deletedLi.querySelector(".li_money").innerText
        );
    }
    liObject.pop(Math.floor(deletedLi.id) - 1);
    incomeText.innerText = String(income_money);

    outcomeText.innerText = String(outcome_money);
    money_text.innerText = String(money);
    list.removeChild(deletedLi);
    saveList();
}

function moneyText(moneyValue) {
    money += Math.floor(moneyValue);
    money_text.innerText = String(money);
}

function addList() {
    title_value = title_input.value;
    money_value = money_input.value;
    title_input.value = "";
    money_input.value = "";
    if (isNaN(money_value)) {
        alert("돈은 숫자로 입력해주세요");
        return;
    }
    if (mode == "outcome") {
        outcome_money += Math.floor(money_value);
        money_value = -1 * Math.floor(money_value);
        outcomeText.innerText = String(outcome_money);
    } else {
        income_money += Math.floor(money_value);
        incomeText.innerText = String(income_money);
    }
    moneyText(money_value);
    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    delBtn.innerText = "❌";
    delBtn.addEventListener("click", deleteList);
    const span1 = document.createElement("span");
    const span2 = document.createElement("span");
    const newId = list.length + 1;
    span2.classList.add("li_money");
    span1.innerText = title_value;
    span2.innerText = money_value;
    if (mode == "income") {
        span2.classList.add("incomeTextMoney");
    } else {
        span2.classList.add("outcomeTextMoney");
    }
    li.appendChild(span1);
    li.appendChild(span2);
    li.appendChild(delBtn);
    li.id = newId;
    list.appendChild(li);
    const liObj = {
        text: title_value,
        money: money_value,
        id: liObject.length + 1,
    };
    liObject.push(liObj);
    saveList();
    updateChart();
}

function paintList(text, money) {
    const li = document.createElement("li");
    const delBtn = document.createElement("button");
    delBtn.innerText = "❌";
    delBtn.addEventListener("click", deleteList);
    delBtn.classList.add("del-btn");
    const span1 = document.createElement("span");
    const span2 = document.createElement("span");
    const newId = list.length + 1;
    span2.classList.add("li_money");
    span1.innerText = text;
    span2.innerText = money;
    if (money > 0) {
        span2.classList.add("incomeTextMoney");
    } else {
        span2.classList.add("outcomeTextMoney");
    }
    li.appendChild(span1);
    li.appendChild(span2);
    li.appendChild(delBtn);
    li.id = newId;
    list.appendChild(li);
    const liObj = {
        text: text,
        money: money,
        id: liObject.length + 1,
    };
    liObject.push(liObj);
    updateChart();
}

function loadList() {
    const money_ls = localStorage.getItem(MONEY_LS);
    money += Math.floor(money_ls);
    money_text.innerText = String(money);
    const in_ls = localStorage.getItem(INCOME_LS);
    income_money += Math.floor(in_ls);
    incomeText.innerText = String(income_money);
    const out_ls = localStorage.getItem(OUTCOME_LS);
    outcome_money += Math.floor(out_ls);
    outcomeText.innerText = String(outcome_money);
    const lodedToDos = localStorage.getItem(LIST_LS);
    if (lodedToDos !== null) {
        const parsedToDos = JSON.parse(lodedToDos);
        parsedToDos.forEach(function(obj) {
            paintList(obj.text, obj.money);
        });
    }
}

function init() {
    loadList();
    money_text.innerText = String(money);
    btn.addEventListener("click", addList);
    updateChart();
}

init();

function updateChart() {}
var data = {
    labels: ["수입", "소비"],
    datasets: [{
        data: [income_money, outcome_money],
        backgroundColor: ["#2abb9b", "#f22613"],
        borderWidth: 0,
        label: "",
    }, ],
};
var ctx = document.querySelector(".chart");
myChart = new Chart(ctx, {
    type: "doughnut",
    data: data,
    options: {
        animation: { animateScale: true, animateRotate: true },
        maintainAspectRatio: false,
        responsive: false,
        cutoutPercentage: 50,
    },
});