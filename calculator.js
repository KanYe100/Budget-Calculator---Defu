// Get references to all input fields

const needsHousing = document.getElementById('housing-amount');
const needsUtilities = document.getElementById('utilities-amount');
const needsFood = document.getElementById('food-amount');
const healthcare = document.getElementById('healthcare-amount');
const loans = document.getElementById('loans-amount');

const wantsEntertainment = document.getElementById('wants-entertainment-amount');
const wantsHobbies = document.getElementById('wants-hobbies-amount');
const wantsClothing = document.getElementById('wants-clothing-amount');
const wantsEatingOut = document.getElementById('wants-eating-out-amount');
const wantsTravel = document.getElementById('wants-travel-amount');

const retirementAmount = document.getElementById('retirement-amount');
const collegeAmount = document.getElementById('college-amount');
const emergencyAmount = document.getElementById('emergency-amount');

const addExpenseNeeds = document.getElementById('expenseButtonNeeds');
const addExpenseWants = document.getElementById('expenseButtonWants');
const addExpenseSavings = document.getElementById('expenseButtonSavings');
const addExpenseMisc = document.getElementById('expenseButtonMisc');

const salary = document.getElementById('salary');


// Federal Tax Function
function calculateFederalTax(incomeAmount) {

    let tax = 0;

    if (incomeAmount <= 12400) {
        tax = incomeAmount * 0.10;
    }
    else if (incomeAmount <= 50400) {
        tax = (12400 * 0.10) +
            ((incomeAmount - 12400) * 0.12);
    }
    else {
        tax = (12400 * 0.10) +
            ((50400 - 12400) * 0.12) +
            ((incomeAmount - 50400) * 0.22);
    }

    return tax;
}



// API
async function careerSelector() {
    const careerSelect = document.getElementById('career-select');
    const careerSalaryMap = new Map();

    try {
        const response = await fetch('https://eecu-data-server.vercel.app/data');
        if (!response.ok) {
            throw new Error('Network response was not okay');
        }
        const users = await response.json();

        users.forEach(user => {

            careerSalaryMap.set(user["Occupation"], user["Salary"]);

            const option = new Option(user["Occupation"], user["Occupation"]);
            careerSelect.add(option);

        });

        careerSelect.addEventListener('change', () => {
            salary.textContent = careerSalaryMap.get(careerSelect.value) || 0;
            calculateBudget();
        });
    }
    catch (error) {
        console.error(error.message);
    }
}

careerSelector();

// Calculate Budget
function calculateBudget() {

    const grossIncome = Number(document.getElementById('salary').textContent) || 0;
    const tax = calculateFederalTax(grossIncome);
    const income = grossIncome - tax;
    const monthlyIncome = income / 12;

    document.getElementById('summmary-gross-monthly-income').textContent = `$${(income / 12).toFixed(2)}`;

    document.getElementById('summary-gross-annual-income').textContent =  `$${income.toFixed(2)}`;

    let needsTotal =
        (Number(needsHousing.value) || 0) +
        (Number(needsUtilities.value) || 0) +
        (Number(needsFood.value) || 0) +
        (Number(healthcare.value) || 0) +
        (Number(loans.value) || 0);

    let wantsTotal =
        (Number(wantsEntertainment.value) || 0) +
        (Number(wantsHobbies.value) || 0) +
        (Number(wantsClothing.value) || 0) +
        (Number(wantsEatingOut.value) || 0) +
        (Number(wantsTravel.value) || 0);

    let savingsTotal =
        (Number(retirementAmount.value) || 0) +
        (Number(collegeAmount.value) || 0) +
        (Number(emergencyAmount.value) || 0);

        let ruleNeeds = monthlyIncome * 0.50;
        let ruleWants = monthlyIncome * 0.30;
        let ruleSavings = monthlyIncome * 0.20;

    let total = monthlyIncome - needsTotal - wantsTotal - savingsTotal;

    const customAmounts = document.querySelectorAll('.custom-amount');

    customAmounts.forEach(input => {
        total -= parseFloat(input.value) || 0;
    });

    const customNeeds = document.querySelectorAll('.custom-needs');

    customNeeds.forEach(input => {
        needsTotal += parseFloat(input.value) || 0;
    });

    const customWants = document.querySelectorAll('.custom-wants');

    customWants.forEach(input => {
        wantsTotal += parseFloat(input.value) || 0;
    });

    if (total < 0) {
        document.getElementById('spending-remaining-summary').textContent = `-$${Math.abs(total).toFixed(2)}`;
        document.getElementById('spending-remaining-summary').style.color = '#FF5A5A';

        document.getElementById('spending-remaining-chart').textContent = `-$${Math.abs(total).toFixed(2)}`;
        document.getElementById('spending-remaining-chart').style.color = '#FF5A5A';
    }

    else {
        document.getElementById('spending-remaining-summary').textContent = `$${total.toFixed(2)}`;
        document.getElementById('spending-remaining-summary').style.color = ''; 

        document.getElementById('spending-remaining-chart').textContent = `$${total.toFixed(2)}`;
        document.getElementById('spending-remaining-chart').style.color = ''; 
    }



    document.getElementById('spending-needs').textContent = `-$${needsTotal.toFixed(2)}`;
    document.getElementById('spending-wants').textContent = `-$${wantsTotal.toFixed(2)}`;
    document.getElementById('spending-savings').textContent = `-$${savingsTotal.toFixed(2)}`;

    document.getElementById('rule-needs').textContent = `$${ruleNeeds.toFixed(2)}`;
    document.getElementById('rule-wants').textContent = `$${ruleWants.toFixed(2)}`;
    document.getElementById('rule-savings').textContent = `$${ruleSavings.toFixed(2)}`;



    // Chart
    const ctx = document.getElementById('budgetChart');
        if (window.budgetChart && typeof window.budgetChart.destroy === 'function') {
            window.budgetChart.destroy();
        }

    function getCustomValues(className) {
        const inputs = document.querySelectorAll(`.${className}`);
        if (!inputs) return [];  // safeguard
        return Array.from(inputs).map(input => Number(input.value) || 0);
    };

    const customWantsValues = getCustomValues('custom-wants') || [];
    const customNeedsValues = getCustomValues('custom-needs') || [];
    const customAmountsValues = getCustomValues('custom-amount') || [];

    const allValues = [
        ...customWantsValues,
        ...customNeedsValues,
        ...customAmountsValues
    ];

    window.budgetChart = new Chart(ctx, {

        type: 'doughnut',
        data: {
            labels: [
                "Housing", "Utilites", "Food", "Healthcare", "Loans", "Entertainment", "Hobbies", "Clothing",
                "Eating Out", "Travel", "Retirement", "College", "Emergency Fund",
            ],

            datasets: [{
                data: [
                    Number(needsHousing.value) || 0,
                    Number(needsUtilities.value) || 0,
                    Number(needsFood.value) || 0,
                    Number(healthcare.value) || 0,
                    Number(loans.value) || 0,
                    Number(wantsEntertainment.value) || 0,
                    Number(wantsHobbies.value) || 0,
                    Number(wantsClothing.value) || 0,
                    Number(wantsEatingOut.value) || 0,
                    Number(wantsTravel.value) || 0,
                    Number(retirementAmount.value) || 0,
                    Number(collegeAmount.value) || 0,
                    Number(emergencyAmount.value) || 0,
                    ...allValues
                ],
                borderWidth: 1
            }]
        }
    });
}

// Replace custom expense input with text
function changeInputToP(input) {
    const value = input.value;
    const parent = input.parentElement;
    const p = document.createElement('p');
    p.textContent = value;
    parent.replaceChild(p, input);
}

// Add extra expenses
addExpenseNeeds.addEventListener('click', () => {
    const newInput = document.createElement('article');
    newInput.innerHTML = `
        <article class="custom-expense-section">
           <input type="text" placeholder="Expense Name" onchange="changeInputToP(this)">
        <article class="input-fields">
            <label>$</label>
            <input type="number" class="custom-amount custom-needs" value="0" onchange="calculateBudget()">
        </article>
    </article>`;
    document.getElementById('needs-inputs').appendChild(newInput);
});


addExpenseWants.addEventListener('click', () => {
    const newInput = document.createElement('article');
    newInput.innerHTML = `
        <article class="custom-expense-section">
           <input type="text" placeholder="Expense Name" onchange="changeInputToP(this)">
        <article class="input-fields">
            <label>$</label>
            <input type="number" class="custom-amount custom-wants" value="0" onchange="calculateBudget()">
        </article>
    </article>`;
    document.getElementById('wants-inputs').appendChild(newInput);
});


addExpenseSavings.addEventListener('click', () => {
    const newInput = document.createElement('article');
    newInput.innerHTML = `
        <article class="custom-expense-section">
           <input type="text" placeholder="Expense Name" onchange="changeInputToP(this)">
        <article class="input-fields">
            <label>$</label>
            <input type="number" class="custom-amount" value="0" onchange="calculateBudget()">
        </article>
    </article>`;
    document.getElementById('savings-inputs').appendChild(newInput);
});


addExpenseMisc.addEventListener('click', () => {
    const newInput = document.createElement('article');
    newInput.innerHTML = `
        <article class="custom-expense-section">
           <input type="text" placeholder="Expense Name" onchange="changeInputToP(this)">
        <article class="input-fields">
            <label>$</label>
            <input type="number" class="custom-amount" value="0" onchange="calculateBudget()">
        </article>
    </article>`;
    document.getElementById('misc-inputs').appendChild(newInput);
});
