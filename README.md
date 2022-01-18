# Sanitize Json

## _inspired from covid-19_

Package is created for singuar purpose, to remove extra properties from a json object. This is most help full if you want to filter incoming requests.

- filter out json
- verify if property matches given conditions
- create custom sanitizer functions:

## Usage

offten there is a sicutation where you get a dirty json data:

```ts
// obj from untrusted source
const dirtyJsonObject = {
  name: 'Panth',
  email: 'email@abc.df',
  age: 20,
  username: 'very_long_username',
  isAdmin: true,
};
```

here isAdmin property should not be.

then create a sanitizer💕:

```ts
const profileSanitizer = isInterfaceAs({
  name: isString,
  email: checkIfIt(isString, isEmail),
  age: checkIfIt(isNumber, isInteger, isIt('>=', 18)),
  username: checkIfIt(
    isString,
    isTrueOnCall(username => username.length > 3 && username.length < 30)
  ),
});
```

then use sanitizer on dirty Json Objects

```ts
const cleanJsonObj = sanitizeJson(profileSanitizer, dirtyJsonObject);
console.log(cleanJsonObj.val);
// { name: 'Panth', email: 'email@abc.df', age: 20, username: 'very_long_username' }
```

you can create basic nested interface sanitizers:

```ts
const someSanitizer = isInterfaceAs({
  a: isInterfaceAs({
    b: isNumber,
    a: isBoolean,
  }),
});
```

you can also have logic opraters "and" or "or":

```ts
const someSanitizer = isInterfaceAs({
  a: applyOr(isNumber, isBoolean),
});

console.log(sanitizeJson(someSanitizer, { a: true }));
// { err: false, val: {a: true} }
console.log(sanitizeJson(someSanitizer, { a: 5 }));
// { err: false, val: {a: 5} }
console.log(sanitizeJson(someSanitizer, { a: 'sa' }));
// { err: true, val: #Error }
```

## APIs:

### isInterfaceAs

```ts
interface a {
  p1: string;
}
interface b {
  a: a;
}

const a = isInterfaceAs({ p1: isString });
const b = isInterfaceAs({ a: a });
```

### applyOr

```ts
type a = string;
interface b {}
type c = a | b;

const a = isString;
const b = isInterfaceAs({});
const c = applyOr(a, b);
```

### switchOn

```ts
interface editPhoneNum {
  editAction: 'phoneNum';
  uid: string;
  phoneNum: number;
}
interface editProfilePic {
  editAction: 'profilePic';
  uid: string;
  url: string;
}
interface editEmailAdderss {
  editAction: 'emailAdderss';
  uid: string;
  email: string;
}
type req = editPhoneNum | editProfilePic | editEmailAdderss;

const editPhoneNumSanitizer = isInterfaceAs({
  editAction: isString,
  uid: isString,
  phoneNum: isNumber,
});
const editProfilePicSanitizer = isInterfaceAs({
  editAction: isString,
  uid: isString,
  url: isString,
});
const editEmailAdderssSanitizer = isInterfaceAs({
  editAction: isString,
  uid: isString,
  email: isString,
});
const reqSanitizer = switchOn(
  req => req.editAction,
  { when: 'phoneNum', then: editPhoneNumSanitizer },
  { when: 'profilePic', then: editProfilePicSanitizer },
  { when: 'emailAdderss', then: editEmailAdderssSanitizer }
);
```

### combine

```ts
interface a {}
interface b {}

type c = a & b;

const a = isInterfaceAs({});
const b = isInterfaceAs({});

const c = combine(a, b);
```

### isListOf

```ts
interface a {}
type b = a[]; // List<a>;
//
const a = isInterfaceAs({});
const b = isListOf(a);
```

### isArrayAs

```ts
interface a {}
interface b {}
interface c {}
type d = [a, b, c];

const a = isInterfaceAs({});
const b = isInterfaceAs({});
const c = isInterfaceAs({});
const d = isArrayAs([a, b, c]);
```

### isMapOf

```ts
interface a {}
type b = { [key: string]: a };

const a = isInterfaceAs({});
const b = isMapOf(a);
```

### checkIfIt

```ts
interface profile {
  ...
  age: number; // number must be int, and (18 or 18+)
}

const profileSanitizer = isInterfaceAs({
  ...,
  age: checkIfIt(isNumber, isInteger, isIt(">=", 18))
})
```

### isTrueOnCall

```ts
interface profile {
  ...
  username: string; // string must pass function isValidUsername
}

function isValidUsername(username: string): boolean {
  ...
}
const profileSanitizer = isInterfaceAs({
  ...,
  username: checkIfIt(isString, isTrueOnCall(isValidUsername))
})
```

# Thanks !
