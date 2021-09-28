// This top one is a default import and cannot be supported
import foo from '.whatever';

// These represent cases which can be converted
import { test, test2 as anotherTest } from './some-test';
import * as bar from './some-other-test';

// Unacceptable with no imports
import {} from './some-other-test';
