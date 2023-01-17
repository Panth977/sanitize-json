import {
  checkIfIt,
  hasValOf,
  shouldBe,
  isListOf,
  isMapOf,
  isStructOf,
  isUndefinedOr,
  matches,
  sanitizeJson,
} from '../src';

type admin_status = { role: 'admin' };
type manager_status = { role: 'manager'; unit: string };
type casher_status = { role: 'casher'; unit: string; cashCounter: string };
type expected_request = {
  name: string;
  username: string;
  home: {
    address: string[];
    cordinates: { lat: number; lon: number };
  };
  stauts: admin_status | manager_status | casher_status;
  friends: { [uid: string]: { name: string; rank: number } };
  age: number | undefined;
};

const expected_request_sanitizor = isStructOf<expected_request>({
  // add simple sanitizor
  name: hasValOf.string,
  // chain multiple sanitizor; do this to validate the formate
  username: checkIfIt(hasValOf.string, matches(/^[A-Za-z0-9_]{30}$/)),
  // create sub-struct/map/interface
  home: isStructOf({
    // list of sanitizor
    address: isListOf(hasValOf.string),
    cordinates: isStructOf({ lat: hasValOf.number, lon: hasValOf.number }),
  }),
  // create custom sanitizor; by returning new object with required data, throw error if incomining data is false/un-usable
  stauts(val) {
    if (typeof val !== 'object' || val === null) throw 'status is not object';
    if (val.role === 'admin') return { role: 'admin' };

    if (typeof val.unit !== 'string') throw 'expected a unit, found non';
    if (val.role == 'manager') return { role: 'manager', unit: val.unit };

    if (typeof val.cashCounter !== 'string')
      throw 'expected a cash-counter, found non';
    if (val.role === 'casher')
      return { role: 'casher', unit: val.unit, cashCounter: val.cashCounter };

    throw 'unrecognized role was found';
  },
  // declere map; keys are string & values are of single type
  friends: isMapOf(
    // give approprite sanitizor
    isStructOf({
      name: hasValOf.string,
      rank: checkIfIt(hasValOf.number, shouldBe('<', 10), shouldBe('>=', 0)),
    })
  ),
  age: isUndefinedOr(hasValOf.number),
});

const result_1 = sanitizeJson(expected_request_sanitizor, {});
expect(result_1.err).toEqual(true);

const result_2 = sanitizeJson(expected_request_sanitizor, {
  name: 'Panth Patel',
  username: 'panthPatel977',
  home: {
    address: ['address line 1', 'address line 2'],
    cordinates: { lat: 10.2681, lon: 35.688168 },
  },
  stauts: { role: 'admin' },
  friends: {
    aidnia6d68nd: { name: 'Harshil', rank: 9 },
    '6ds5cvs6d4': { name: 'Vyom', rank: 11 },
  },
});
expect(result_2.err).toEqual(false);
if (!result_2.err) {
  expect(result_2.val).toEqual({
    name: 'Panth Patel',
    username: 'panthPatel977',
    home: {
      address: ['address line 1', 'address line 2'],
      cordinates: { lat: 10.2681, lon: 35.688168 },
    },
    stauts: { role: 'admin' },
    friends: { aidnia6d68nd: { name: 'Harshil', rank: 9 } },
    age: undefined,
  });
}
