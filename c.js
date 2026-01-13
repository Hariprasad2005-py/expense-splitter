let group = {
    name: "",
    members: [],
    expenses: [],
    balances: {}
};

function createGroup() {
    const groupNameInput = document.getElementById('groupName');
    const groupName = groupNameInput.value.trim();

    if (groupName === "") {
        alert("Please enter group name");
        return;
    }

    alert("Group " + groupName + " created successfully");

    group.name = groupName;
    group.members = [];
    group.expenses = [];
    group.balances = {};

    document.getElementById('memberList').innerHTML = "";
    document.getElementById('expenseList').innerHTML = "";
    document.getElementById('historyList').innerHTML = "";
    document.getElementById('balanceList').innerHTML = "";
    document.getElementById('expensePayer').innerHTML =
        '<option value="" disabled>Select Payer(s)</option>';

    groupNameInput.value = "";
}

function addMember() {
    const memberInput = document.getElementById('memberName');
    const memberName = memberInput.value.trim();

    if (memberName === "") {
        alert("Please enter member name");
        return;
    }

    if (group.members.includes(memberName)) {
        alert("Member already exists");
        return;
    }

    group.members.push(memberName);
    updateMemberList();
    updateDropdown();

    memberInput.value = "";
}

function updateMemberList() {
    const memberList = document.getElementById('memberList');
    memberList.innerHTML = "";

    group.members.forEach(member => {
        const li = document.createElement('li');
        li.textContent = member;
        memberList.appendChild(li);
    });
}

function updateDropdown() {
    const payerSelect = document.getElementById('expensePayer');
    payerSelect.innerHTML =
        '<option value="" disabled>Select Payer(s)</option>';

    group.members.forEach(member => {
        const option = document.createElement('option');
        option.value = member;
        option.textContent = member;
        payerSelect.appendChild(option);
    });
}

function addExpense() {
    const description = document.getElementById('expenseDescription').value.trim();
    const amount = parseFloat(document.getElementById('expenseAmount').value);
    const payerSelect = document.getElementById('expensePayer');

    const selectedPayers = Array.from(payerSelect.selectedOptions)
        .map(option => option.value);

    if (description === "") {
        alert("Please enter expense description");
        return;
    }

    if (isNaN(amount) || amount <= 0) {
        alert("Please enter valid expense amount");
        return;
    }

    if (selectedPayers.length === 0) {
        alert("Please select at least one payer");
        return;
    }

    const expense = {
        description,
        amount,
        payers: selectedPayers
    };

    group.expenses.push(expense);

    document.getElementById('expenseDescription').value = "";
    document.getElementById('expenseAmount').value = "";
    payerSelect.selectedIndex = -1;

    updateExpenseList();
    updateHistoryList();
    calculateBalances();
    displayBalances();
}

function updateExpenseList() {
    const expenseList = document.getElementById('expenseList');
    expenseList.innerHTML = "";

    group.expenses.forEach(expense => {
        const li = document.createElement('li');
        li.textContent =
            `${expense.description} - ₹${expense.amount.toFixed(2)} paid by ${expense.payers.join(", ")}`;
        expenseList.appendChild(li);
    });
}

function updateHistoryList() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = "";

    group.expenses.forEach(expense => {
        const li = document.createElement('li');
        li.textContent =
            `${expense.description} - ₹${expense.amount.toFixed(2)} paid by ${expense.payers.join(", ")}`;
        historyList.appendChild(li);
    });
}

function calculateBalances() {
    const balances = {};

    group.members.forEach(member => balances[member] = 0);

    group.expenses.forEach(expense => {
        const sharePerPerson = expense.amount / group.members.length;

        group.members.forEach(member => {
            balances[member] -= sharePerPerson;
        });

        const paidPerPayer = expense.amount / expense.payers.length;
        expense.payers.forEach(payer => {
            balances[payer] += paidPerPayer;
        });
    });

    group.balances = balances;
}

function displayBalances() {
    const balanceList = document.getElementById('balanceList');
    balanceList.innerHTML = "";

    Object.keys(group.balances).forEach(member => {
        const balance = group.balances[member];
        if (Math.abs(balance) < 0.01) return;

        const li = document.createElement('li');
        li.textContent =
            balance > 0
                ? `${member} should receive ${formatCurrency(balance)}`
                : `${member} owes ${formatCurrency(-balance)}`;

        balanceList.appendChild(li);
    });
}

function resetGroup() {
    group = {
        name: "",
        members: [],
        expenses: [],
        balances: {}
    };

    document.getElementById('groupName').value = "";
    document.getElementById('memberName').value = "";
    document.getElementById('expenseDescription').value = "";
    document.getElementById('expenseAmount').value = "";
    document.getElementById('expensePayer').innerHTML =
        '<option value="" disabled>Select Payer(s)</option>';

    document.getElementById('memberList').innerHTML = "";
    document.getElementById('expenseList').innerHTML = "";
    document.getElementById('historyList').innerHTML = "";
    document.getElementById('balanceList').innerHTML = "";
}

function formatCurrency(amount) {
    return `₹${amount.toFixed(2)}`;
}

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("creategrpbutton").addEventListener("click", createGroup);
    document.getElementById("addMemberButton").addEventListener("click", addMember);
    document.getElementById("addExpenseButton").addEventListener("click", addExpense);
    document.getElementById("resetBtn").addEventListener("click", resetGroup);
});
