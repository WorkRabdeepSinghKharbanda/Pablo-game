import { create } from 'zustand';
import { SUIT, RANK } from '../../Utils/Constant';
interface CARD {
    card_type: SUIT,
    card_values: RANK,
}

interface TABLE_TYPE {
    tableData: Record<SUIT, CARD[]>;
    setCardTypeToTableTop: (passedCardDetails: CARD) => void;
    setCardTypeToTableBottom: (passedCardDetails: CARD) => void;
}


export const useCardTable = create<TABLE_TYPE>((set) => ({
    tableData: {} as Record<SUIT, CARD[]>,
    setCardTypeToTableTop: (passedCardDetails: CARD) => set((state) => {
        const newTableData = { ...state.tableData };
        if (!newTableData[passedCardDetails.card_type]) {
            newTableData[passedCardDetails.card_type] = [];
        }
        newTableData[passedCardDetails.card_type].unshift(passedCardDetails);
        return { tableData: newTableData };
    }),
    setCardTypeToTableBottom: (passedCardDetails: CARD) => set((state) => {
        const newTableData = { ...state.tableData };
        if (!newTableData[passedCardDetails.card_type]) {
            newTableData[passedCardDetails.card_type] = [];
        }
        newTableData[passedCardDetails.card_type].push(passedCardDetails);
        return { tableData: newTableData };
    })
}));



// export const useCardValidateTable = create((set)=> ({
    
// }))
// if(Object.keys(typeData) === passedCardDetails.card_type) {
//     if(
//         passedCardDetails.card_values !== CARD_VALUE.ACE &&
//         passedCardDetails.card_values !== CARD_VALUE.JACK &&
//         passedCardDetails.card_values !== CARD_VALUE.QUEEN &&
//         passedCardDetails.card_values !== CARD_VALUE.KING &&
//     ) {

//         if()
//         typeData.length.card_values + 1< )
//     typeData.push(passedCardDetails)

//     }
// }