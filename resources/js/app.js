var  controllData = (
  function () {

    var Expense = function (id , description , value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
    var Income = function (id , description , value) {
      this.id = id;
      this.description = description;
      this.value = value;
    }
    var calculateTotal = function (type) {
      var sum = 0;
      data.allItems[type].forEach(function (cur) {
        sum += cur.value;
        data.total[type] = sum;
      })
    }
    var data = {
      allItems : {
        exp : [],
        inc : []
      },
      total : {
        exp : 0,
        inc : 0
      },
      budget : 0,
      percentage : -1
    }

    return {
      addItems : function (type ,des , val) {
        var ID , newItem;

        if (ID > 0) {
          ID = data.allItems[type][data.allItems[type].length - 1] + 1;
        } else {
          ID = 0;
        }
  
        if (type === 'exp') {
          newItem = new Expense (ID , des , val);
        } else if (type === 'inc') {
          newItem = new Income (ID , des , val);
        }
        data.allItems[type].push(newItem);
  
        return newItem;
        },
        calculateBudget : function () {
          calculateTotal("inc");
          calculateTotal("exp");

          data.budget = data.total.inc - data.total.exp;

          if (data.budget > 0) {
            data.percentage = Math.round(data.total.exp / data.budget * 100); 
          } else {
            data.percentage = -1;
          }
        },
        getBudget : function () {
          return {
            budget : data.budget,
            totalInc : data.total.inc,
            totalExp : data.total.exp,
            percentage : data.percentage
          }
        },
        testing : function () {
          console.log(data);
        }

    } 
    

  }
) ();



var controllUI =(
  function () {

    var DOMstrings = {
      inputType : '.add__type',
      inputDescription : '.add__description',
      inputValue : '.add__value',
      inputBtn : '.add__btn',
      incomeContainer : '.income__list',
      expensesContainer : '.expenses__list'
    }

    return {
      getDOMstrings : function () {
        return DOMstrings;
      },
      addListItem : function (obj , type) {
        var html , newHtml , element;

        if (type === 'inc') {
          element = DOMstrings.incomeContainer;
          html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        } else if (type === 'exp') {
          element = DOMstrings.expensesContainer;
          html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
        }
        // 大文字かも
        newHtml = html.replace('%id%' , obj.ID);
        newHtml = newHtml.replace('%description%' , obj.description);
        newHtml = newHtml.replace('%value%' , obj.value);

        document.querySelector(element).insertAdjacentHTML('beforeend' , newHtml);
      },
      cleaeFields : function () {
        var fields

        fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);

        fieldsArr = Array.prototype.slice.call(fields);

        fieldsArr.forEach( function (cur , i , arr) {
          cur.value = ''
        })
        fieldsArr[0].focus();
      },
      getInput : function () {
        return {
          type : document.querySelector(DOMstrings.inputType).value,
          description : document.querySelector(DOMstrings.inputDescription).value,
          value : parseFloat(document.querySelector(DOMstrings.inputValue).value) 
        }
      }
    }


  }
) ();



var controller =(
  function (ctrlData , ctrlUI) {

    var setupEventListner = function () {
      var DOM = ctrlUI.getDOMstrings();
      document.querySelector(DOM.inputBtn).addEventListener('click' , addItems);
      document.addEventListener('keypress' , function (event) {
        if (event.keyCode === 13 || event.which ===13) {
          addItems();
        }
      })

    }

    var updateBudget = function () {
      ctrlData.calculateBudget();
      var budget = ctrlData.getBudget();
      console.log(budget);
    }


    var addItems = function () {
      var input , newItem;

      input = ctrlUI.getInput();

      if (input.description !== '' && input.value > 0 && !isNaN(input.value)) {
        newItem = ctrlData.addItems(input.type , input.description , input.value);
  
        ctrlUI.addListItem(newItem , input.type);
  
        ctrlUI.cleaeFields();
  
        updateBudget();

      }


    }

    return {
      init : function () {
        setupEventListner();
      }
    }

  }
) (controllData , controllUI);

controller.init();