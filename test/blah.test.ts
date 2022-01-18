import {
  interfaceOf,
  isEmail,
  is,
  checkIf,
  isUndefinedOr,
  applyOr,
  isCallTrue,
  switchOn,
  sanitizeJson,
} from '../src';

const sanitizer = interfaceOf({
  email: checkIf(is.string, isEmail),
  name: is.string,
  applyClaims: isUndefinedOr(
    applyOr(
      isCallTrue(x => x === 'admin'),
      switchOn(
        (x: any) => x.role,
        {
          when: 'manager',
          then: interfaceOf({ role: is.string, stockId: is.string }),
        },
        {
          when: 'accountent',
          then: interfaceOf({
            role: is.string,
            stockId: is.string,
            cashCounter: is.string,
          }),
        }
      )
    )
  ),
});
