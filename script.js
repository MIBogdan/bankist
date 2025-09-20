'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

// Data
const account1 = {
  owner: 'Marius Bogdan',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
  type: 'premium',
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
  type: 'standard',
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
  type: 'premium',
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
  type: 'basic',
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function (movements, sort = false) {
  containerMovements.innerHTML = '';

  let movs = sort
    ? movements.slice().sort((a, b) => {
        return a - b;
      })
    : movements;

  movs.forEach((mov, i) => {
    const type = mov > 0 ? 'deposit' : 'withdrawal';

    const html = `
          <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            
            <div class="movements__value">${mov}€</div>
        </div>
    `;

    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

const calcDisplaySummary = function (account) {
  const incomes = account.movements
    .filter(mov => {
      return mov > 0;
    })
    .reduce((acc, cur) => {
      return acc + cur;
    }, 0);
  labelSumIn.textContent = `${incomes}€`;

  const out = account.movements
    .filter(mov => {
      return mov < 0;
    })
    .reduce((acc, cur) => {
      return acc - cur;
    }, 0);

  labelSumOut.textContent = `${Math.abs(out)}€`;

  const interest = account.movements
    .filter(mov => {
      return mov > 0;
    })
    .map(deposit => {
      return (deposit * account.interestRate) / 100;
    })
    .filter(int => {
      return int >= 1;
    })
    .reduce((acc, int) => {
      return acc + int;
    }, 0);

  labelSumInterest.textContent = `${interest}€`;
};

const createUsernames = function (accs) {
  accs.forEach(acc => {
    acc.username = acc.owner
      .toLowerCase()
      .split(' ')
      .map(name => {
        return name[0];
      })
      .join('');
  });
};

createUsernames(accounts);

const calcDisplayBalance = function (acc) {
  acc.balance = acc.movements.reduce((acc, mov) => {
    return acc + mov;
  }, 0);

  labelBalance.textContent = `${acc.balance}€`;
};

const updateUI = function (acc) {
  // Display movements
  displayMovements(acc.movements);

  // Display balance
  calcDisplayBalance(acc);

  // Display summary
  calcDisplaySummary(acc);
};

let currentAccount;

// Event handlers
btnLogin.addEventListener('click', e => {
  e.preventDefault();
  currentAccount = accounts.find(acc => {
    return acc.username === inputLoginUsername.value;
  });

  if (currentAccount?.pin === Number(inputLoginPin.value)) {
    // Display UI and message
    labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
    containerApp.style.opacity = 1;

    // Clear input fields
    inputLoginUsername.value = '';
    inputLoginPin.value = '';
    inputLoginPin.blur();

    // Update UI
    updateUI(currentAccount);
  }
});

btnTransfer.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputTransferAmount.value);
  const receiverAcc = accounts.find(acc => {
    return acc.username === inputTransferTo.value;
  });
  inputTransferAmount.value = '';
  inputTransferTo.value = '';

  if (
    amount > 0 &&
    receiverAcc &&
    currentAccount.balance >= amount &&
    receiverAcc?.username !== currentAccount.username
  ) {
    currentAccount.movements.push(-amount);
    receiverAcc.movements.push(amount);

    // Update UI
    updateUI(currentAccount);
  }
});

btnLoan.addEventListener('click', e => {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);

  if (
    amount > 0 &&
    currentAccount.movements.some(mov => {
      return mov >= (amount * 10) / 100;
    })
  ) {
    currentAccount.movements.push(amount);
    updateUI(currentAccount);
  }
});

btnClose.addEventListener('click', e => {
  e.preventDefault();

  if (
    inputCloseUsername.value === currentAccount.username &&
    Number(inputClosePin.value) === currentAccount.pin
  ) {
    const index = accounts.findIndex(acc => {
      return acc.username === currentAccount.username;
    });

    accounts.splice(index, 1);
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = '';
  inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', e => {
  e.preventDefault();
  displayMovements(currentAccount.movements, !sorted);
  sorted = !sorted;
});

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

/////////////////////////////////////////////////

// let arr = ['a', 'b', 'c', 'd', 'e'];

// SLICE (does not mutate the original array)

// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));

// SPLICE (does mutate the original array, deletes and returns the items that it takes out)

// arr.splice(-1);
// arr.splice(1, 2)
// console.log(arr);

// REVERSE (does mutate the array)

// let arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT (doesn't mutate the array)
// const letters = arr.concat(arr2);
// console.log(letters);
// console.log(...arr, ...arr2);

// // JOIN (doesn't mutate the array)
// console.log(letters.join(" - "));

// const arr = [23, 11, 64];
// console.log(arr[0]);
// console.log(arr.at(0));

// // Getting the last element
// console.log(arr[arr.length - 1]);
// console.log(arr.slice(-1)[0]);

// console.log(arr.at(-1));
// console.log('Marius'.at(0));
// console.log('Marius'.at(-1));

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// for (const movement of movements) {
//   if (movement > 0) {
//     console.log(`You deposited ${movement}`);
//   } else {
//     console.log(`Your withdrew ${Math.abs(movement)}`);
//   }
// }
// console.log('---- FOR EACH ----');
// movements.forEach((movement, index) => {
//   if (movement > 0) {
//     console.log(`Movement ${index + 1}: You deposited ${movement}`);
//   } else {
//     console.log(`Movement ${index + 1}: Your withdrew ${Math.abs(movement)}`);
//   }
// });

// const currencies = new Map([
//   ['USD', 'United States dollar'],
//   ['EUR', 'Euro'],
//   ['GBP', 'Pound sterling'],
// ]);

// // MAP
// currencies.forEach((value, key, map) => {
//   console.log(`Key: ${key}, Value: ${value}`);
// })

// // SET
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);
// currenciesUnique.forEach((value, _, map) => {
//   console.log(`Value: ${value}, Value: ${value}`);
// })

// TEST DATA 1: Julia's data [3, 5, 2, 12, 7], Kate's data [4, 1, 15, 8, 3]
// TEST DATA 2: Julia's data [9, 16, 6, 8, 3], Kate's data [10, 5, 6, 1, 4]

// const checkDogs = function (julia, kate) {
//   const juliaArray = julia.splice(1, 2);
//   const finalArr = juliaArray.concat(kate);
//   finalArr.forEach((dog, i) => {
//     dog >= 3
//       ? console.log(`Dog number ${i + 1} is an adult, and is ${dog} years old.`)
//       : console.log(`Dog number ${i + 1} is still a puppy.`);
//   });
// };

// checkDogs([3, 5, 2, 12, 7], [4, 1, 15, 8, 3]);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const eurToUsd = 1.1;
// const movementsUSD = movements.map((mov) => {
//   return mov * eurToUsd
// });

// console.log(movements);
// console.log(movementsUSD);

// const newArr = [];

// for (const mov of movements) {
//   newArr.push(mov * eurToUsd);
// }

// console.log(newArr);

// const movementsDescriptions = movements.map((mov, i) => {

//     return `Movement ${i + 1}: You ${mov > 0 ? `deposited` : `withdrew`} ${Math.abs(mov)}`

// })

// console.log(movementsDescriptions);

// const deposits =  movements.filter(function(mov) {
//   return mov > 0;
// })
// console.log(movements);
// console.log(deposits);

// const depositsFor = [];
// for (const mov of movements) {
//   if (mov > 0) {
//     depositsFor.push(mov);
//   }
// }
// console.log(depositsFor);

// const withdrawals = movements.filter(function(mov) {
//   return mov < 0;
// })

// console.log(withdrawals);

// const withdrawalsFor = [];

// for (const withdrawal of withdrawals) {
//   if (withdrawal < 0) {
//     withdrawalsFor.push(withdrawal);
//   }
// }
// console.log(withdrawalsFor);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements);

// // accoumulator -> SNOWBALL

// const balance = movements.reduce(function(acc, cur, i, arr) {
//   console.log(`Iteration ${i}: ${acc}`);
//   return acc + cur;
// }, 0);
// console.log(balance);

// let balance2 = 0;

// for (const mov of movements) {
//   balance2 += mov;
// }
// console.log(balance2);

// // Maximum value

// const max = movements.reduce((acc, mov) => {
//   return acc > mov ? acc : mov;
// }, movements[0]);
// console.log(max);

// let testData = [5, 2, 4, 1, 15, 8, 3]

// const calcAverageHumanAge = function(arr) {

//   let newAges = arr
//     .map(val => {
//       if (val <= 2) {
//         return 2 * val;
//       } else {
//         return 16 + val * 4;
//       }
//     })
//     .filter(age => {
//       return age >= 18;
//     })
//     .reduce((acc, cur, i, arr) => {
//     return acc + cur / arr.length;
//     }, 0)

//   return console.log(newAges);
// }

// calcAverageHumanAge(testData)

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// const eurToUsd = 1.1;

// // PIPELINE
// const totalDepositsUSD = movements
//   .filter((mov) => {
//     return mov > 0;
//   })
//   .map((mov, i, arr) => {
//     console.log(arr);
//     return mov * eurToUsd;
//   })
//   .reduce((acc, mov) => {
//     return acc + mov;
//   }, 0);

// console.log(totalDepositsUSD);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// const firstWithdrawal = movements.find(mov => {
//   return mov < 0;
// });

// console.log(firstWithdrawal);
// console.log(accounts);

// const account = accounts.find((acc) => {
//   return acc.owner === 'Jessica Davis';
// });

// console.log(account);

// const getAccount = function(accounts) {
//   for (let acc of accounts) {
//     if (acc.owner === 'Jessica Davis') {
//       return console.log(acc);
//     }
//   }
// }

// getAccount(accounts);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);
// const lastWithdrawal = movements.findLast((mov) => {
//   return mov < 0;
// })

// console.log(lastWithdrawal);

// const latestLargeMovementIndex = movements.findLastIndex((mov) => {
//   return Math.abs(mov) > 1000
// })

// console.log(`Your latest large movement was ${movements.length - latestLargeMovementIndex} movements ago`);

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // console.log(movements.includes(-130));

// // SOME: CONDITION
// const anyDeposits = movements.some(mov => {
//   return mov > 5000;
// });

// console.log(anyDeposits);

// // EVERY
// console.log(
//   movements.every(mov => {
//     return mov > 0;
//   })
// );

// // Separate callback
// const deposit = (mov) => {
//   return mov > 0;
// }

// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// const arr = [[1, 2, 3], [4, 5, 6], 7, 8];
// console.log(arr.flat());

// const arrDeep = [[[1, 2], 3], [4, [5, 6]], 7, 8];
// console.log(arrDeep.flat(2));

// const accountMovements = accounts.map(acc => {
//   return acc.movements;
// });

// const allMovements = accountMovements.flat();
// const overallBalance = allMovements.reduce((accumulator, current) => {
//   return accumulator + current;
// });

// console.log(overallBalance);

// const overallBalance2 = accounts
//   .flatMap((acc) => {
//     return acc.movements;
//   })
//   .reduce((acc, cur) => {
//     return acc + cur;
//   }, 0);

// console.log(overallBalance2);

/*
YOUR TASKS:
1. Store the the average weight of a "Husky" in a variable "huskyWeight"
2. Find the name of the only breed that likes both "running" and "fetch" ("dogBothActivities" variable)
3. Create an array "allActivities" of all the activities of all the dog breeds
4. Create an array "uniqueActivities" that contains only the unique activities (no activity repetitions). HINT: Use a technique with a special data structure that we studied a few sections ago.
5. Many dog breeds like to swim. What other activities do these dogs like? Store all the OTHER activities these breeds like to do, in a unique array called "swimmingAdjacent".
6. Do all the breeds have an average weight of 10kg or more? Log to the console whether "true" or "false".
7. Are there any breeds that are "active"? "Active" means that the dog has 3 or more activities. Log to the console whether "true" or "false".

BONUS: What's the average weight of the heaviest breed that likes to fetch? HINT: Use the "Math.max" method along with the ... operator.

*/

// const breeds = [
//   {
//     breed: 'German Shepherd',
//     averageWeight: 32,
//     activities: ['fetch', 'swimming'],
//   },
//   {
//     breed: 'Dalmatian',
//     averageWeight: 24,
//     activities: ['running', 'fetch', 'agility'],
//   },
//   {
//     breed: 'Labrador',
//     averageWeight: 28,
//     activities: ['swimming', 'fetch'],
//   },
//   {
//     breed: 'Beagle',
//     averageWeight: 12,
//     activities: ['digging', 'fetch'],
//   },
//   {
//     breed: 'Husky',
//     averageWeight: 26,
//     activities: ['running', 'agility', 'swimming'],
//   },
//   {
//     breed: 'Bulldog',
//     averageWeight: 36,
//     activities: ['sleeping'],
//   },
//   {
//     breed: 'Poodle',
//     averageWeight: 18,
//     activities: ['agility', 'fetch'],
//   },
// ];
// // 1.
// const huskyWeight = breeds.find(breed => {
//   return breed.breed === 'Husky';
// }).averageWeight;
// console.log(huskyWeight);

// // 2.
// const dogBothActivities = breeds.find(breed => {
//   return (
//     breed.activities.includes('fetch') && breed.activities.includes('running')
//   );
// });
// console.log(dogBothActivities);

// // 3.
// const allActivities = breeds
//   .map(breed => {
//     return breed.activities;
//   })
//   .flat();
// console.log(allActivities);

// // 4.
// const uniqueActivities = [...new Set(allActivities)];
// console.log(uniqueActivities);

// // 5.
// const swimmingAdjacent = [
//   ...new Set(
//     breeds
//       .filter(breed => {
//         return breed.activities.includes('swimming');
//       })
//       .flatMap(breed => {
//         return breed.activities;
//       })
//       .filter((activity) => {
//         return activity !== 'swimming'
//       })
//   ),
// ];
// console.log(swimmingAdjacent);

// // 6.
// console.log(
//   breeds.every(breed => {
//     return breed.averageWeight > 10
//   })
// );

// // 7.
// console.log(
//   breeds.some(breed => {
//     return breed.activities.length >= 3;
//   })
// );

// // BONUS
// const fetchBreeds = breeds
//   .filter(breed => {
//     return breed.activities.includes('fetch');
//   })
//   .map(breed => {
//     return breed.averageWeight;
//   });
// const heaviestFetchBreed = Math.max(...fetchBreeds)

// console.log(heaviestFetchBreed);

// Strings
// const owners = ['Marius', 'Zach', 'Adam', 'Martha'];
// console.log(owners.sort());
// console.log(owners);

// // Numbers
// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];
// console.log(movements);

// // return < 0 then A, B (keep order)
// // return > 0 then B, A (switch order)

// // Ascending
// // movements.sort((a, b) => {
// //   if (a > b) {
// //     return 1;
// //   }

// //   if (a < b) {
// //     return -1;
// //   }
// // });

// movements.sort((a, b) => {
//   return a - b
// });
// console.log(movements);

// // Descending
// // movements.sort((a, b) => {
// //   if (a > b) {
// //     return -1;
// //   }

// //   if (a < b) {
// //     return 1;
// //   }
// // });

// movements.sort((a, b) => {
//   return b - a;
// });

// console.log(movements);

// ARRAY GROUPING

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// console.log(movements);

// const groupedMovements = Object.groupBy(movements, movement => {
//   return movement > 0 ? 'deposits' : 'withdrawals';
// });

// console.log(groupedMovements);

// const groupedByActivity = Object.groupBy(accounts, account => {
//   const movementCount = account.movements.length;
//   if (movementCount >= 8) return 'very active';
//   if (movementCount >= 4) return 'active';
//   if (movementCount >= 1) return 'moderate';
//   return 'inactive';
// });
// console.log(groupedByActivity);

// const groupByType = Object.groupBy(accounts, account => {
//   return account.type;
// });

// console.log(groupByType);

// const arr = [1, 2, 3, 4, 5, 6, 7];
// console.log(new Array(1, 2, 3, 4, 5, 6, 7));

// // Empty arrays + fill method
// const x = new Array(7);
// console.log(x);

// // console.log((x.map(() => 5)));

// x.fill(1, 3, 5);
// x.fill(1);
// console.log(x);

// arr.fill(23, 2, 6);
// console.log(arr);

// // Array.from
// const y = Array.from({ length: 7 }, () => 1);
// console.log(y);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// const random = Array.from({ length: 100 }, (cur, i) => {
//   return Math.floor(Math.random() * 6 + 1);
// });
// console.log(random);

// let arrTest = [];

// for (let [index, element] of random.entries()) {
//   const test = random[index + 1];
//   arrTest.push(`${element} ${test}`);
// }
// console.log(`Test Array: ${arrTest}`);

// labelBalance.addEventListener('click', () => {
//   const movementsUI = Array.from(
//     document.querySelectorAll('.movements__value'),
//     (el => {
//       return Number(el.textContent.replace('€', ''));
//     })
//   );
//   console.log(movementsUI);

// });

// const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// // toReversed doesn't change the original array
// const reversedMov = movements.toReversed();
// console.log(reversedMov);
// console.log(movements);

// // toSorted doesn't change the original array
// // toSpliced doesn't change the original array

// // movements[1] = 2000
// const newMovements = movements.with(1, 2000)
// console.log(newMovements);
// console.log('Original: ', movements);

// // 1.
// const bankDepositSum = accounts
//   .flatMap(acc => {
//     return acc.movements;
//   })
//   .filter(mov => {
//     return mov > 0;
//   })
//   .reduce((sum, current) => {
//     return sum + current;
//   }, 0);

// console.log(bankDepositSum);

// // 2.
// // const numDeposits1000 = accounts.flatMap((acc) => {
// //   return acc.movements;
// // }).filter((mov) => {
// //   return mov >= 1000;
// // }).length

// const numDeposits1000 = accounts
//   .flatMap(acc => {
//     return acc.movements;
//   })
//   // .reduce((count, current) => {
//   //   return current >= 1000 ? count + 1 : count;
//   // }, 0)
//   .reduce((count, current) => {
//     return current >= 1000 ? ++count : count;
//   }, 0);

// console.log(numDeposits1000);

// // Prefixed ++ operator
// let a = 10;
// console.log(++a);

// // 3.
// const { deposits, withdrawals } = accounts
//   .flatMap(acc => {
//     return acc.movements;
//   })
//   .reduce(
//     (sums, currentValue) => {
//       // currentValue > 0 ? sums.deposits += currentValue : sums.withdrawals += currentValue;
//       sums[currentValue > 0 ? 'deposits' : 'withdrawals'] += currentValue;
//       return sums;
//     },
//     { deposits: 0, withdrawals: 0 }
//   );

// console.log(deposits, withdrawals);

// // 4.
// // this is a nice title -> This Is a Nice Title
// const convertTitleCase = function (title) {
//   const capitalize = str => str[0].toUpperCase() + str.slice(1);
//   const exceptions = ['a', 'an', 'and', 'the', 'but', 'or', 'on', 'in', 'with'];

//   const titleCase = title
//     .toLowerCase()
//     .split(' ')
//     .map(word => {
//       return exceptions.includes(word)
//         ? word
//         : capitalize(word);
//     }).join(' ');
//   return capitalize(titleCase);
// };

// console.log(convertTitleCase('this is a nice title'));
// console.log(convertTitleCase('this is a LONG title but not too long'));
// console.log(convertTitleCase('and here is another title with an EXAMPLE'));

///////////////////////////////////////
// Coding Challenge #5

/* 
Julia and Kate are still studying dogs. This time they are want to figure out if the dogs in their are eating too much or too little food.

- Formula for calculating recommended food portion: recommendedFood = weight ** 0.75 * 28. (The result is in grams of food, and the weight needs to be in kg)
- Eating too much means the dog's current food portion is larger than the recommended portion, and eating too little is the opposite.
- Eating an okay amount means the dog's current food portion is within a range 10% above and below the recommended portion (see hint).

YOUR TASKS:
1. Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood) and add it to the object as a new property. Do NOT create a new array, simply loop over the array (We never did this before, so think about how you can do this without creating a new array).
2. Find Sarah's dog and log to the console whether it's eating too much or too little. HINT: Some dogs have multiple users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓
3. Create an array containing all owners of dogs who eat too much (ownersTooMuch) and an array with all owners of dogs who eat too little (ownersTooLittle).
4. Log a string to the console for each array created in 3., like this: "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!"
5. Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false)
6. Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false)
7. Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.)
8. Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little', based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion.
9. Group the dogs by the number of owners they have
10. Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array!

HINT 1: Use many different tools to solve these challenges, you can use the summary lecture to choose between them 😉
HINT 2: Being within a range 10% above and below the recommended portion means: current > (recommended * 0.90) && current < (recommended * 1.10). Basically, the current portion should be between 90% and 110% of the recommended portion.
*/

const dogs = [
  { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
  { weight: 8, curFood: 200, owners: ['Matilda'] },
  { weight: 13, curFood: 275, owners: ['Sarah', 'John', 'Leo'] },
  { weight: 18, curFood: 244, owners: ['Joe'] },
  { weight: 32, curFood: 340, owners: ['Michael'] },
];

// // 1.
// /* Loop over the array containing dog objects, and for each dog, calculate the recommended food portion (recFood) and add it to the object as a new property.
// Do NOT create a new array, simply loop over the array (We never did this before, so think about how you can do this without creating a new array). */

// // ---------My solution
// // const recFood = dogs.map(dog => {
// //   const recommendedFood = dog.weight ** 0.75 * 28;
// //   return (dog.recFood = Number(Math.floor(recommendedFood)));
// // });

dogs.forEach(dog => {
  return (dog.recFood = Math.floor(dog.weight ** 0.75 * 28));
});

console.log(dogs[0].recFood);

// // ---------Teacher's solution
// dogs.forEach(dog => {
//   return (dog.recFood = Math.floor(dog.weight ** 0.75 * 28));
// });

// console.log(dogs);

// // 2.
// /* Find Sarah's dog and log to the console whether it's eating too much or too little.
// HINT: Some dogs have multiple users, so you first need to find Sarah in the owners array, and so this one is a bit tricky (on purpose) 🤓 */

// // ---------My solution
// // const findSarah = dogs.filter(dog => {
// //   return dog.owners.includes('Sarah');
// // })[0];

// // if (findSarah.curFood > findSarah.recFood) {
// //   console.log(`Sarah's dog is eating too much.`);
// // } else {
// //   console.log(`Sarah's dog is not eating too much.`);
// // }
// // console.log(findSarah);
const dogSarah = dogs.find(dog => {
  return dog.owners.includes('Sarah');
});

console.log(
  `Sarah's dog is eating too ${
    dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
  }`
);

// // ---------Teacher's solution
// const dogSarah = dogs.find(dog => {
//   return dog.owners.includes('Sarah');
// });
// console.log(
//   `Sarah's dog eaths too ${
//     dogSarah.curFood > dogSarah.recFood ? 'much' : 'little'
//   }`
// );

// // 3.
// /* Create an array containing all owners of dogs who eat too much (ownersTooMuch) and an array with all owners of dogs who eat too little (ownersTooLittle). */

// // ---------My solution
// // const ownersTooMuch = dogs
// //   .filter(dog => {
// //     return dog.curFood > dog.recFood;
// //   })
// //   .flatMap(dog => {
// //     return dog.owners;
// //   });

// // console.log(ownersTooMuch);

const ownersTooMuch = dogs
  .filter(dog => {
    return dog.curFood > dog.recFood;
  })
  .flatMap(dog => {
    return dog.owners;
  });

const ownersTooLittle = dogs
  .filter(dog => {
    return dog.curFood < dog.recFood;
  })
  .flatMap(dog => {
    return dog.owners;
  });

console.log(ownersTooMuch);
console.log(ownersTooLittle);

// // ---------Teacher's solution
// const ownersTooMuch = dogs
//   .filter(dog => {
//     return dog.curFood > dog.recFood;
//   })
//   .flatMap(dog => {
//     return dog.owners;
//   });
// const ownersTooLittle = dogs
//   .filter(dog => {
//     return dog.curFood < dog.recFood;
//   })
//   .flatMap(dog => {
//     return dog.owners;
//   });
// console.log(ownersTooMuch);
// console.log(ownersTooLittle);

// // 4.
// /* Log a string to the console for each array created in 3., like this:
// "Matilda and Alice and Bob's dogs eat too much!" and "Sarah and John and Michael's dogs eat too little!" */

// // ---------My solution
// // const owners = ownersTooMuch.join(" and ")
// // console.log(`${owners} dogs eat too much!`);

console.log(
  `${ownersTooMuch.join(
    ' and '
  )}'s dogs are eating too much and ${ownersTooLittle.join(
    ' and '
  )} are eating too little`
);

// // ---------Teacher's solution
// console.log(`${ownersTooMuch.join(' and ')} are eating too much`);
// console.log(`${ownersTooLittle.join(' and ')} are eating too little`);

// // 5.
// /* Log to the console whether there is ANY dog eating EXACTLY the amount of food that is recommended (just true or false) */

// // ---------My solution
// // const exactAmount = dogs.flatMap((dog) => {
// //   return dog.curFood === dog.recFood;
// // }).includes(true);

// // console.log(exactAmount);

console.log(
  `${dogs.some(dog => {
    return dog.curFood === dog.recFood;
  })}`
);

// // ---------Teacher's solution
// console.log(
//   dogs.some(dog => {
//     return dog.curFood === dog.recFood;
//   })
// );

// // 6.
// /* Log to the console whether ALL of the dogs are eating an OKAY amount of food (just true or false) */

// // ---------My solution
// // const okAmount = dogs.flatMap((dog) => {
// //   return dog.curFood > (dog.recFood * 0.9) && dog.curFood < (dog.recFood * 1.10) ? true : false;
// // }).includes(true);

// // console.log(okAmount);

console.log(
  `${dogs.every(dog => {
    return dog.curFood === dog.recFood;
  })}`
);

// // ---------Teacher's solution
// const checkEatingOkay = dog => {
//   return dog.curFood < dog.recFood * 1.1 && dog.curFood > dog.recFood * 0.9;
// };

// console.log(dogs.every(checkEatingOkay));

// // dogs.forEach(dog => {
// //   console.log(
// //     `Current food: ${dog.curFood}, Recommended food: ${dog.recFood}, 10%: ${(
// //       dog.recFood *
// //       (10 / 100)
// //     ).toFixed(2)} 10% above: ${
// //       dog.recFood + dog.recFood * (10 / 100)
// //     }, 10% below: ${dog.recFood - dog.recFood * (10 / 100)}`
// //   );
// // });

// // 7.
// /* Create an array containing the dogs that are eating an OKAY amount of food (try to reuse the condition used in 6.) */

// // ---------My solution
// // const okAmountDogs = dogs
// //   .filter(dog => {
// //     return dog.curFood > dog.recFood * 0.9 && dog.curFood < dog.recFood * 1.1

// //   });
// // console.log(okAmountDogs);

const checkDogsEatingOkay = function (dog) {
  return (
    dog.curFood > dog.recFood - (10 * dog.recFood) / 100 &&
    dog.curFood < dog.curFood + (10 * dog.recFood) / 100
  );
};

const dogsEatingOkay = dogs.filter(checkDogsEatingOkay);
console.log(dogsEatingOkay);

// // ---------Teacher's solution

// const dogsEatingOkay = dogs.filter(checkEatingOkay);
// console.log(dogsEatingOkay);

// // 8.
// /* Group the dogs into the following 3 groups: 'exact', 'too-much' and 'too-little',
// based on whether they are eating too much, too little or the exact amount of food, based on the recommended food portion. */

// // ---------My solution
// // const grouped = Object.groupBy(dogs, (dog) => {
// //   if (dog.curFood === dog.recFood) return 'exact';
// //   if (dog.curFood > dog.recFood) return 'too-much';
// //   if (dog.curFood < dog.recFood) return 'too-little'
// // })

// // console.log(grouped);

const groupedDogs = Object.groupBy(dogs, (dog) => {
  if (dog.curFood > dog.recFood) {
    return 'tooMuch'
  } else if (dog.curFood < dog.recFood) {
    return 'tooLittle'
  }
  return 'exact'
});

console.log(groupedDogs);

// // ---------Teacher's solution
// const dogsGroupedByPortion = Object.groupBy(dogs, dog => {
//   if (dog.curFood > dog.recFood) {
//     return 'too-much';
//   } else if (dog.curFood < dog.recFood) {
//     return 'too-little';
//   } else {
//     return 'exact';
//   }
// });
// console.log(dogsGroupedByPortion);

// // 9.
// /* Group the dogs by the number of owners they have */

const groupedByOwners = Object.groupBy(dogs, (dog) => {
  return `${dog.owners.length}-Owners`
})


console.log(groupedByOwners);
// // ---------My solution
// // const grouped1 = Object.groupBy(dogs, dog => {
// //   if (dog.owners.length === 1) return '1 Owner'
// //   if (dog.owners.length === 2) return '2 Owners'
// //   if (dog.owners.length === 3) return '3 Owners'
// // });
// // console.log(grouped1);

// // ---------Teacher's solution
// const dogsGroupedByOwners = Object.groupBy(dogs, dog => {
//   return `${dog.owners.length}-Owners`
// });
// console.log(dogsGroupedByOwners);

// // 10.
// /* Sort the dogs array by recommended food portion in an ascending order. Make sure to NOT mutate the original array! */
const sortedByFood = dogs.toSorted((a, b) => {
  return a.recFood - b.recFood
})

console.log(sortedByFood);
console.log(dogs);

// // ---------My solution
// // const ascending = dogs.map((dog) => {
// //   return dog.recFood
// // }).slice().sort()

// // console.log(ascending);

// // ---------Teacher's solution
// const dogsSorted = dogs.toSorted((a, b) => {
//   return a.recFood - b.recFood;
// })
// console.log(dogsSorted);
