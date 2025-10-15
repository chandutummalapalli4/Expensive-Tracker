$(document).ready(function () {
  // Load expenses from localStorage or initialize empty array
  let expenses = JSON.parse(localStorage.getItem("expenses")) || [];

  // Save expenses to localStorage
  function saveExpenses() {
    localStorage.setItem("expenses", JSON.stringify(expenses));
  }

  // Render expenses to the list with optional month filter
  function renderExpenses(filterMonth = "") {
    $("#expense-list").empty();
    let total = 0;

    const filteredExpenses = filterMonth
      ? expenses.filter(e => e.date.startsWith(filterMonth))
      : expenses;

    filteredExpenses.forEach((expense, index) => {
      const item = $(`
        <li class="list-group-item">
          <div>
            <strong>${expense.name}</strong><br>
            <small>${expense.date}</small>
          </div>
          <div>
            ₹${parseFloat(expense.amount).toFixed(2)}
            <button class="btn btn-sm btn-warning btn-edit" data-index="${index}">Edit</button>
            <button class="btn btn-sm btn-danger btn-delete" data-index="${index}">Delete</button>
          </div>
        </li>
      `);
      $("#expense-list").append(item);
      total += parseFloat(expense.amount);
    });

    $("#total-amount").text(total.toFixed(2));
  }

  // Add or Edit expense
  $("#expense-form").submit(function (e) {
    e.preventDefault();
    const name = $("#expense-name").val().trim();
    const amount = parseFloat($("#expense-amount").val());
    const date = $("#expense-date").val();
    const editIndex = $(this).data("editIndex");

    if (!name || !amount || !date || amount <= 0) {
      alert("Please enter valid expense details.");
      return;
    }

    const expenseData = { name, amount, date };

    if (editIndex != null) {
      expenses[editIndex] = expenseData;
      $(this).removeData("editIndex");
    } else {
      expenses.push(expenseData);
    }

    saveExpenses();
    renderExpenses($("#filter-month").val());
    this.reset();
  });

  // Delete expense
  $("#expense-list").on("click", ".btn-delete", function () {
    const index = $(this).data("index");
    if (confirm("Are you sure you want to delete this expense?")) {
      expenses.splice(index, 1);
      saveExpenses();
      renderExpenses($("#filter-month").val());
    }
  });

  // Edit expense
  $("#expense-list").on("click", ".btn-edit", function () {
    const index = $(this).data("index");
    const expense = expenses[index];

    $("#expense-name").val(expense.name);
    $("#expense-amount").val(expense.amount);
    $("#expense-date").val(expense.date);
    $("#expense-form").data("editIndex", index);
  });

  // Filter by month
  $("#filter-month").on("change", function () {
    renderExpenses(this.value);
  });

  // Initial render
  renderExpenses();
});