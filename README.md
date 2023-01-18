# Sanitize Json

## _inspired from covid-19_

Package is created for singuar purpose, to remove extra properties from a json object. This is most help full if you want to filter incoming requests.

- filter out json
- verify if property matches given conditions
- create custom sanitizer functions:

## [Github](https://github.com/Panth977/sanitize-json)

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
const profileSanitizer = isStructOf({
  name: hasValOf.string,
  email: checkIfIt(hasValOf.string, isEmail),
  age: checkIfIt(hasValOf.number, isInteger, shouldBe('>=', 18)),
  username: checkIfIt(
    hasValOf.string,
    is(username => username.length > 3 && username.length < 30)
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
const someSanitizer = isStructOf({
  a: isStructOf({
    b: hasValOf.number,
    a: hasValOf.boolean,
  }),
});
```

you can also have logic opraters "and" or "or":

```ts
const someSanitizer = isStructOf({
  a: either(hasValOf.number, hasValOf.boolean),
});

console.log(sanitizeJson(someSanitizer, { a: true }));
// { err: false, val: {a: true} }
console.log(sanitizeJson(someSanitizer, { a: 5 }));
// { err: false, val: {a: 5} }
console.log(sanitizeJson(someSanitizer, { a: 'sa' }));
// { err: true, val: #Error }
```

## Consept (create your own sanitizor)

```ts
interface data {}

function dataSanitizor(val: data): data {
  if (data_in_val_is_valid) return create_copy_of(val);
  throw 'reason, what was wrong with ${val}';
}
```

## APIs: (prebuilt sanitizor)

### isStructOf

```ts
interface a {
  p1: string;
}
interface b {
  a: a;
}

const a = isStructOf({ p1: hasValOf.string });
const b = isStructOf({ a: a });
```

### isStructOf

```ts
type address = [string, string, string | undefined];

const address = isArrayOf([
  hasValOf.string,
  hasValOf.string,
  isUndefinedOr(hasValOf.string),
]);
```

### either

```ts
type a = string;
interface b {}
type c = a | b;

const a = hasValOf.string;
const b = isStructOf({});
const c = either(a, b);
```

### combine

```ts
interface a {}
interface b {}

type c = a & b;

const a = isStructOf({});
const b = isStructOf({});

const c = combine(a, b);
```

### isListOf

```ts
interface a {}
type b = a[]; // List<a>;
//
const a = isStructOf({});
const b = isListOf(a);
```

### isMapOf

```ts
interface a {}
type b = { [key: string]: a };

const a = isStructOf({});
const b = isMapOf(a);
```

### checkIfIt

```ts
interface profile {
  ...
  age: number; // number must be int, and (18 or 18+)
}

const profileSanitizer = isStructOf({
  ...,
  age: checkIfIt(hasValOf.number, isInteger, shouldBe(">=", 18))
})
```

### is

```ts
interface profile {
  ...
  username: string; // string must pass function validUsername
}

function validUsername(username: string): boolean {
  ...
}
const profileSanitizer = isStructOf({
  ...,
  username: checkIfIt(hasValOf.string, is(validUsername))
})
```

# Thanks !
