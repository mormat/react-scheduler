
import { utils } from '@mormat/jscheduler_ui';

function cleanEventValues( values ) {
    const cleanedValues = { ...values }
    for (const k of ['start', 'end']) {
        cleanedValues[k] = utils.format_date(
            'yyyy-mm-dd hh:ii',
            cleanedValues[k]
        );
    }
    return cleanedValues;
}

export {
    cleanEventValues
}



