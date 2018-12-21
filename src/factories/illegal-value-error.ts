import { TIllegalValueErrorFactory } from '../types';

export const createIllegalValueError: TIllegalValueErrorFactory = () => {
    try {
        return new DOMException('', 'IllegalValueError');
    } catch (err) {
        // @todo err.code;
        err.name = 'IllegalValueError';

        return err;
    }
};
