

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

const incomeAmount = document.getElementById('income-amount');

const incomeFrequency = document.getElementById('income-frequency');

const addExpenseNeeds = document.getElementById('expenseButtonNeeds');
const addExpenseWants = document.getElementById('expenseButtonWants');
const addExpenseSavings = document.getElementById('expenseButtonSavings');
const addExpenseMisc = document.getElementById('expenseButtonMisc');

// initalize gross income variable
let grossIncome = 0;

// Function to calculate federal tax based on taxable income
function calculateFederalTax() { // FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX FIX
    let taxableIncome = incomeAmount;
    let tax = 0;

    if (taxableIncome <= 12400) {
        tax = taxableIncome * 0.10;
    }
    else if (taxableIncome <= 50400) {
        tax = (12400 * 0.10) +
            ((taxableIncome - 12400) * 0.12);
    }
    else {
        tax = (12400 * 0.10) +
            ((50400 - 12400) * 0.12) +
            ((taxableIncome - 50400) * 0.22);
    }

    return tax;
}

async function getData() { // FIX FIX FIX
    const url = "https://eecu-data-server.vercel.app/data";

    try {
        const response = await fetch(url);

        if (!response.ok) {

          throw new Error(`Response status: ${response.status}`);
        }
    
        const result = await response.json();
        console.log(result);



      } catch (error) {
        console.error(error.message);
      }
    
}

// LOCAL STORAGE LOCAL STORAGE LOCAL STORAGE

// Function to calculate the budget based on user input (ran every time an input changes)
function calculateBudget() {

    if (incomeFrequency.value === 'monthly') {
        document.getElementById('summmary-gross-monthly-income').textContent = `$${incomeAmount.value}`;
        document.getElementById('summary-gross-annual-income').textContent = `$${(incomeAmount.value * 12)}`;
    } else if (incomeFrequency.value === 'annually') {
        document.getElementById('summmary-gross-monthly-income').textContent = `$${(incomeAmount.value / 12).toFixed(2)}`;
        document.getElementById('summary-gross-annual-income').textContent = `$${incomeAmount.value}`;
    } else if (incomeFrequency.value === 'biweekly') {
        document.getElementById('summmary-gross-monthly-income').textContent = `$${((incomeAmount.value * 26) / 12).toFixed(2)}`;
        document.getElementById('summary-gross-annual-income').textContent = `$${incomeAmount.value * 26}`;
    }


    let needsTotal = Number(needsHousing.value) + Number(needsUtilities.value) + Number(needsFood.value) + Number(healthcare.value) + Number(loans.value);
    let wantsTotal = Number(wantsEntertainment.value) + Number(wantsHobbies.value) + Number(wantsClothing.value) + Number(wantsEatingOut.value) + Number(wantsTravel.value);
    let savingsTotal = Number(retirementAmount.value) + Number(collegeAmount.value) + Number(emergencyAmount.value);

    let ruleNeeds = Number(incomeAmount.value / 2);
    let ruleWants = Number(incomeAmount.value / 3);
    let ruleSavings = Number(incomeAmount.value / 5);

    let total = incomeAmount.value - needsTotal - wantsTotal - savingsTotal;

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
        document.getElementById('spending-remaining').textContent = `-$${Math.abs(total).toFixed()}`;
        document.getElementById('spending-remaining').style.color = '#FF5A5A';
    } else {
        document.getElementById('spending-remaining').textContent = `$${total.toFixed(2)}`;
        document.getElementById('spending-remaining').style.color = '';
    }


    document.getElementById('spending-needs').textContent = `-$${needsTotal.toFixed(2)}`;
    document.getElementById('spending-wants').textContent = `-$${wantsTotal.toFixed(2)}`;
    document.getElementById('spending-savings').textContent = `-$${savingsTotal.toFixed(2)}`;

    document.getElementById('rule-needs').textContent = `$${ruleNeeds.toFixed(2)}`;
    document.getElementById('rule-wants').textContent = `$${ruleWants.toFixed(2)}`;
    document.getElementById('rule-savings').textContent = `$${ruleSavings.toFixed(2)}`;

    //Render the chart
    const ctx = document.getElementById('budgetChart');
    // Destroy the existing chart instance if it exists to prevent multiple charts from overlapping
   // Ensure window.budgetChart is a valid Chart.js instance before destroying it
if (window.budgetChart && typeof window.budgetChart.destroy === 'function') {
    window.budgetChart.destroy();
}


function getCustomValues(className) {
    const inputs = document.querySelectorAll(`.${className}`); // Select all inputs with the given class
    return Array.from(inputs).map(input => Number(input.value) || 0); // Convert values to numbers
}

// Collect values for custom wants, needs, and amounts
const customWantsValues = getCustomValues('custom-wants'); // Replace 'custom-wants' with the actual class name
const customNeedsValues = getCustomValues('custom-needs'); // Replace 'custom-needs' with the actual class name
const customAmountsValues = getCustomValues('custom-amounts'); // Replace 'custom-amounts' with the actual class name

// Combine all values into the chart dataset
const allValues = [
    ...customWantsValues,
    ...customNeedsValues,
    ...customAmountsValues
];

const expenseName = document.getElementById('custom-amount');

// Create a new Chart.js instance
window.budgetChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: ['Housing', 'Utilities', 'Food', 'Healthcare', 'Loans', 'Entertainment', 'Hobbies',
                'Clothing', 'Eating Out', 'Travel', '401k', 'College', 'Emergecy Fund'],
        datasets: [{
            data: [
                needsHousing.value,
                needsUtilities.value,
                needsFood.value,
                healthcare.value,
                loans.value,
                wantsEntertainment.value,
                wantsHobbies.value,
                wantsClothing.value,
                wantsEatingOut.value,
                wantsTravel.value,
                retirementAmount.value,
                collegeAmount.value,
                emergencyAmount.value,
                allValues
            ],
            borderWidth: 1
        }]
    }
});
}

function changeInputToP() {
    const input = document.getElementById('custom-expense');
    const value = input.value;
    const parent = input.parentElement;

    const p = document.createElement('p');
    p.textContent = value;

    parent.replaceChild(p, input);
}

// Add extra expense input fields when the user clicks the "Add Expense" button
addExpenseNeeds.addEventListener('click', () => {
    const newInput = document.createElement('article');
    newInput.innerHTML =
    `<article class="custom-expense-section">
           <input type="text" placeholder="Expense Name" id="custom-expense" onchange="changeInputToP()">
        <article class="input-fields">
            <label for="housing-amount">$</label>
            <input type="number" id="custom-amount" class="custom-amount custom-wants" value="0" onchange="calculateBudget()">
        </article>
    </article>`;

    const parent = document.getElementById('needs-inputs');
    const lastChild = parent.lastElementChild;

    if (lastChild) {
        parent.insertBefore(newInput, lastChild);
    } else {
        parent.appendChild(newInput);
    }
});

addExpenseWants.addEventListener('click', () => {
    const newInput = document.createElement('article');
    newInput.innerHTML =
    `<article class="custom-expense-section">
           <input type="text" placeholder="Expense Name" id="custom-expense" onchange="changeInputToP()">
        <article class="input-fields">
            <label for="housing-amount">$</label>
            <input type="number" id="custom-amount" class="custom-amount custom-wants" value="0" onchange="calculateBudget()">
        </article>
    </article>`;

    const parent = document.getElementById('wants-inputs');
    const lastChild = parent.lastElementChild;

    if (lastChild) {
        parent.insertBefore(newInput, lastChild);
    }
    else {
        parent.appendChild(newInput);
    }
}
);

addExpenseSavings.addEventListener('click', () => {
    const newInput = document.createElement('article');
    newInput.innerHTML =
    `<article class="custom-expense-section">
           <input type="text" placeholder="Expense Name" id="custom-expense" onchange="changeInputToP()">
        <article class="input-fields">
            <label for="housing-amount">$</label>
            <input type="number" id="custom-amount" class="custom-amount custom-wants" value="0" onchange="calculateBudget()">
        </article>
    </article>`;

    const parent = document.getElementById('savings-inputs');
    const lastChild = parent.lastElementChild;

    if (lastChild) {
        parent.insertBefore(newInput, lastChild);
    }
    else {
        parent.appendChild(newInput);
    }
}
);

addExpenseMisc.addEventListener('click', () => {
    const newInput = document.createElement('article');
    newInput.innerHTML =
    `<article class="custom-expense-section">
           <input type="text" placeholder="Expense Name" id="custom-expense" onchange="changeInputToP()">
        <article class="input-fields">
            <label for="housing-amount">$</label>
            <input type="number" id="custom-amount" class="custom-amount custom-wants" value="0" onchange="calculateBudget()">
        </article>
    </article>`;

    const parent = document.getElementById('misc-inputs');
    const lastChild = parent.lastElementChild;

    if (lastChild) {
        parent.insertBefore(newInput, lastChild);
    }
    else {
        parent.appendChild(newInput);
    }
}
);


