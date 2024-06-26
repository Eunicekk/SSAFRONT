# 35장 스프레드 문법📎

> 스프레드 문법(...)은 하나로 뭉쳐 있는 여러 값들의 집합을 펼쳐서 개별적인 값들의 목록으로 만든다.

스프레드 문법을 사용할 수 있는 대상은 Array. String, Map, Set 등 for... of 문으로 순회할 수 있는 이터러블에 한정된다.

```javascript
// 개별 요소로 분리한다.
console.log(... [1, 2, 3]); // 1 2 3

// 문자열은 이터러블이다.
console.log( ... 'Hello'); // H e l l o

// Map과 Set은 이터러블이다.
console.log( ... new Map([['a', '1'], ['b', '2']])); // ['a', '1'] ['b', '2']
console.log( ... new Set([1, 2, 3])); // 1 2 3

// 이터러블이 아닌 일반 객체는 스프레드 문법의 대상이 될 수 없다.
console.log(... { a: 1, b: 2 });
// TypeError: Found non-callable Spread syntax requires ...iterable[Symbol.iterator] to be a function

// 스프레드 문법의 결과는 값이 아니다.
const list = ... [1, 2, 3]; // SyntaxError: Unexpected token ...
// 1 2 3은 값이 아니라 개별적인 값들의 목록 1 2 3이다.
```

스프레드 문법의 결과물은 값으로 사용할 수 없고, 쉼표로 구분한 값의 목록을 사용하는 문맥에서만 사용할 수 있다.
- 함수 호출문의 인수 목록
- 배열 리터럴의 요소 목록
- 객체 리터럴의 프로퍼티 목록

<br>

## 35.1 함수 호출문의 인수 목록에서 사용하는 경우

요소들의 집합인 배열을 펼쳐서 개별적인 값들의 목록으로 만든 후, 이를 함수의 인수 목록으로 전달해야 하는 경우 사용한다.

```javascript
Math.max(1); // 1
Math.max(1, 2); // 2
Math.max(1, 2, 3); // 3
Math.max(); // -Infinity

//숫자가 아닌 배열이 들어오면 NaN을 반환한다.
Math.max([1, 2, 3]); // NaN

// 스프레드 문법이 제공되기 이전에는 Function.prototype.apply를 사용했다.
var arr = [1, 2, 3];

// apply 함수의 2번째 인수(배열)는 apply 함수가 호출하는 함수의 인수 목록이다.
// 따라서 배열이 펼쳐져서 인수로 전달되는 효과가 있다.
var max = Math.max.apply(null, arr);
console.log(max); // 3

const arr1 = [1, 2, 3];
// 스프레드 문법을 사용하여 배열 arr을 1, 2, 3으로 펼쳐서 Math.max에 전달한다.
// Math.max(... [1, 2, 3])은 Math.max(l, 2, 3)과 같다.
const max1 = Math.max(... arr1); // 3
console.log(max1); // 3
```

**혼동 주의**⁉️ 

Rest 파라미터는 함수에 전달된 인수들의 목록을 배열로 전달받기 위해 매개변수 이름 앞에 ... 을 붙이는 것이다. 스프레드 문법은 여러 개의 값이 하나로 뭉쳐 있는 배열과 같은 이터러블을 펼쳐서 개별적인 값들의 목록을 만드는 것이다. 따라서 Rest 파라미터와 스프레드 문법은 서로 반대의 개념이다.

```javascript
// Rest 파라미터는 인수들의 목록을 배열로 전달받는다.
function foo( ... rest) {
  console.log(rest); // 1, 2, 3 -> [ 1, 2, 3 ]
}

// 스프레드 문법은 배열과 같은 이터러블을 펼쳐서 개별적인 값들의 목록을 만든다.
// [1, 2, 3] —> 1, 2, 3
foo( ... [1, 2, 3]);
```

<br>

## 35.2 배열 리터럴 내부에서 사용하는 경우

#### 35.2.1 concat

ES5에서 2개의 배열을 결합하고 싶은 경우 배열 리터럴만으로 해결할 수 없고 concat 메서드를 사용해야 한다.
하지만 스프레드 문법을 사용하면 별도의 메서드를 사용하지 않고 2개의 배열을 결합할 수 있다.

```javascript
// ES5
var arr = [1, 2].concat([3, 4]);
console.log(arr); // [1, 2, 3, 4]

// E56
const arr1 = [ ... [1, 2], ... [3, 4]];
console.log(arr1); // [1, 2, 3, 4]
```

#### 35.2.2 splice

ES5에서 어떤 배열의 중간에 다른 배열의 요소들을 추가하거나 제거하려면 splice 메서드를 사용한다.

```javascript
// ES5
var arr1 = [1, 4];
var arr2 = [2, 3];

// 이것을 이용해 [1, 2, 3, 4]를 만들려고 한다. 이때 다음과 같이 하면 
arr1.splice(1, 0, arr2); // [1, [2, 3], 4] 와 같은 결과가 나온다.

var arr3 = [1, 4];
var arr4 = [2, 3];

/*
apply 메서드의 2번째 인수 [1, 0].concat(arr3)는 [1, 0, 2, 3]으로 평가된다.
따라서 apply 메서드의 의해 [1, 0, 2, 3]이 해체되어 전달된다.
즉, arr3[1]부터 0개의 요소를 제거하고 새로운 요소(2, 3)를 삽입한다.
*/
Array.prototype.splice.apply(arr3, [1, 0].concat(arr4));
console.log(arr3); // [1, 2, 3, 4]

// 하지만 스프레드 문법을 사용하면 더욱 간결하다.
// ES6
const arr5 = [1, 4];
const arr6 = [2, 3];

arr5.splice(1, 0, ... arr6);
console.log(arr5); // [1, 2, 3, 4]
```

#### 35.2.3 배열 복사

ES5에서 배열을 복사하려면 slice 메서드를 사용한다.

```javascript
// ES5
var origin = [1, 2];
var copy = origin.slice();

// 얕은 복사
console.log(copy); // [1, 2]
console.log(copy === origin); // false

// ES6
const origin = [1, 2];
const copy = [... origin];

// 얕은 복사
console.log(copy); // [1, 2]
console.log(copy === origin); // false
```

#### 35.2.4 이터러블을 배열로 변환

ES5에서 이터러블을 배열로 변환하려면 Function.prototype.apply 또는 Function.prototype.call 메서드를 사용하여 slice 메서드를 호출해야 한다.

```javascript
// ES5
function sum() {
  // 이터러블이면서 유사 배열 객체인 arguments를 배열로 변환
  var args = Array.prototype.slice.call(arguments);
  return args.reduce(function (pre, cur) {
    return pre + cur;
  }, 0);
}

console.log(sum(1, 2, 3)); // 6

// 이터러블이 아닌 유사 배열 객체도 배열로 변환할수 있다.

// 이터러블이 아닌 유사 배열 객체
const arrayLike = {
  0: 1,
  1: 2,
  2: 3,
  length: 3
};

const arr = Array.prototype.slice.call(arrayLike); // [1, 2, 3]
console.log(Array.isArray(arr)); // true
```

arguments 객체는 이터러블이므로 스프레드 문법을 사용해 배열로 변환할 수 있다.

```javascript
function sum() {
  // 이터러블이면서 유사 배열 객체인 arguments를 배열로 변환
  return [ ... arguments].reduce((pre, cur) => pre + cur, 0);
}

console.log(sum(1, 2, 3)); // 6

// 또는 Rest 파라미터를 사용할 수 있다.

// Rest 파라미터 args는 함수에 전달된 인수들의 목록을 배열로 전달받는다.
const sum = ( ... args) => args.reduce((pre, cur) => pre + cur, 0);
console.log(sum(1, 2, 3)); // 6
```

단, 이터러블이 아닌 유사 배열 객체는 스프레드 문법의 대상이 될 수 없지만 ES6에서 도입된 Array.from 메서드를 사용하면 배열로 변환하여 반환할 수 있다.

```javascript
// 이터러블이 아닌 유사 배열 객체
const arrayLike = {
  0: 1,
  1: 2,
  2: 3,
  length: 3
};

const arr = [... arrayLike];
// TypeError: arrayLike is not iterable

// Array.from은 유사 배열 객체 또는 이터러블을 배열로 변환한다.
Array.from(arrayLike); // [1, 2, 3]
```

<br>

## 35.3 객체 리터럴 내부에서 사용하는 경우

Rest 프로퍼티와 함께 TC39 프로세스의 stage 4단계에 제안되어 있는 스프레드 프로퍼티를 사용하면 객체 리터럴의 프로퍼티 목록에서도 스프레드 문법을 사용할 수 있다. 스프레드 프로퍼티 제안은 일반 객체를 대상으로도 스프레드 문법의 사용을 허용한다.

```javascript
// 스프레드 프로퍼티
// 얕은 복사
const obj = { x: 1, y: 2 };
const copy = { ... obj };
console.log(copy); // { x: 1, y: 2 }
console.log(obj === copy); // false

// 객체 병합
const merged = { x: 1, y: 2, ... { a: 3, b: 4 } };
console.log(merged); // { x: 1, y: 2, a: 3, b: 4 }
```

스프레드 프로퍼티가 제안되기 이전에는 ES6에서 도입된 Object.assign 메서드를 사용하여 여러 개의 객체를 병합하거나 특정 프로퍼티를 변경 또는 추가했다.

```javascript
// 객체 병합. 프로퍼티가 중복되는 경우 뒤에 위치한 프로퍼티가 우선권을 갖는다.
const merged = Object.assign({}, { x: 1, y: 2 }, { y: 10, z: 3 });
console.log(merged); // { x: 1, y: 10, z: 3 }

// 특정 프로퍼티 변경
const changed = Object.assign({}, { x: 1, y: 2 }, { y: 100 });
console.log(changed); // { x: l, y: 100 }

// 프로퍼티 추가
const added = Object.assign({}, { x: 1, y: 2 }, { z: 0 });
console.log(added); // { x: 1, y: 2, z: 0 }

// 스프레드 프로퍼티는 Object.assign 메서드를 대체할 수 있는 간편한 문법이다.

// 객체 병합. 프로퍼티가 중복되는 경우 뒤에 위치한 프로퍼티가 우선권을 갖는다.
const merged1 = { ... { x: 1, y: 2 }, ... { y: 10, z: 3 } };
console.log(merged1); // { x: 1, y: 10, z: 3 }

// 특정 프로퍼티 변경
const changed1 = { ... { x: 1, y: 2 }, y: 100 }; 
console.log(changed1); // { x: 1, y: 100 }

// 프로퍼티 추가
const added1 = { ... { x: 1, y: 2 }, z: 0 }; 
console.log(added1); // { x: 1, y: 2, z: 0 }
```
