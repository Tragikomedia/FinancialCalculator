function helpNPV()
{
    alert("NPV, MIRR i Zdyskontowany okres zwrotu - INSTRUKCJA\n" + "1. Po wpisaniu liczby (np. lat) pojawią się kolejne okienka\n" + "2. Zamiast przecinków należy używać kropek\n" +
        "3. Niektóre pola nie muszą być wypełnione (np. wartość sprzedaży albo stopa reinwestycji, kiedy nie interesuje nas MIRR)\n" +
        "4. Kurs walutowy - jeśli chcemy otrzymać wynik w USD, a dane mamy w PLN, należy wpisać w to pole X z równania 1 USD = X PLN\n" +
        "5. W pola z procentem wpisać należy samą wartość, np. 10, a nie 10%\n" +
        "6. Ujemne przepływy (poza rokiem 0) i efekt kanibalizmu wpisujemy z minusem\n" +
        "7. Kropki zamiast przecinków!\n");
}

function helpPercent()
{
    alert("Oprocentowanie kredytów i lokat - INSTRUKCJA\n" + "1. Nie wszystkie pola muszą zostać wypełnione\n" + "2. Zamiast przecinków należy używać kropek\n" +
        "3. Możliwe jest wyszukanie PV, FV oraz oprocentowania - pole z szukaną pozostawiamy puste, pozostałe dwa wypełniamy\n" +
        "4. Kurs walutowy - gdy chcemy otrzymać wynik w USD, a dane mamy w PLN, w to pole wpisujemy X z równania 1 PLN = X USD\n" +
        "5. W pola z procentem wpisać należy samą wartość, np. 10, a nie 10%\n" +
        "6. Kapitalizacja - liczba kapitalizacji w jednostce czasu, np. gdy czas w latach, a kapitalizacja miesięczna - wpisujemy 12" +
        "7. Walutowa stopa kredytu - jeśli kurs odpowiada X w 1USD = X PLN - otrzymamy dolarową stopę\n" +
        "8.Odwracarka kursu - z 1 USD = X PLN robi 1 PLN = Y USD\n");
}

function helpCapital()
{
    alert("Kapitał obcy, własny, CAPM i WACC - INSTRUKCJA\n" + "1. Nie wszystkie pola muszą zostać wypełnione - tylko te istotne dla tego, co chcemy obliczyć\n" +
        "2. Zamiast przecinków należy używać kropek\n" +
        "3. Do obliczenia WACC konieczne jest podanie danych do obliczenia min. jednej z pozostałych klasyfikacji\n" +
        "4. W przypadku akcji zwykłych - gdy firma dopiero planuje wypłacić dywidendę, wpisujemy dane w pole Dywidenda R1, w przeciwnym wypadku Dywidenda R0. Nigdy w oba!\n" +
        "5. W pola z procentem wpisać należy samą wartość, np. 10, a nie 10%\n" +
        "6. Procenty w WACC powinny dopełniać się do 100\n")
}

function formulaNPV()
{
    let x = document.getElementById("formulasnetPV");
    if (x.style.display === "none"){
        x.style.display = "block";
    }
    else {
        x.style.display = "none";
    }
    }

function formulaPercent()
{
    let x = document.getElementById("formulasPercent");
    if (x.style.display === "none"){
        x.style.display = "block";
    }
    else {
        x.style.display = "none";
    }
    }

function formulaCapital()
{
    let x = document.getElementById("formulasCapital");
    if (x.style.display === "none"){
        x.style.display = "block";
    }
    else {
        x.style.display = "none";
    }
    }

function changeCurrency()
{
    var x = document.getElementById("changeableCurrency").value;
    x = parseFloat(x);
    x = 1/x;
    let element = document.getElementById("currencyResult");
    element.innerHTML = "Odwrócony kurs = " + x;
}

function countCreditRate()
{
    var percent = parseFloat(document.getElementById("percenta").value)/100;
    var spotex = parseFloat(document.getElementById("spotex").value)/100;
    var forwardex = parseFloat(document.getElementById("forward2").value)/100;
    var currencyCreditRate = document.getElementById("currencyCreditRate");
    var currencyCredit = ((1 + percent) * (1 + (forwardex - spotex)/spotex) - 1)*100
    currencyCreditRate.innerHTML = "Walutowa stopa = " + (Math.round((currencyCredit + Number.EPSILON) * 10000) / 10000) + "%";
}

function countPercent()
{
    var percentYear = parseFloat(document.getElementById("percentYear").value);
    var pV = parseFloat(document.getElementById("presentValue").value);
    var fV = parseFloat(document.getElementById("futureValue").value);
    var percentage = parseFloat(document.getElementById("percentage").value)/100;
    var capitalization = parseFloat(document.getElementById("capitalization").value);
    var currencyEx = parseFloat(document.getElementById("forwardex").value);
    var compound = true;
    var element = document.getElementById("percentResult");
    if (isNaN(currencyEx)) {
        currencyEx = 1;
    }
    if (isNaN(capitalization)){
        compound = false;
        capitalization = 1;
    }
    var result = 0;
    if (isNaN(pV)) {
        if (compound){
            result = (fV * currencyEx)/Math.pow((1 + percentage/capitalization), (capitalization * percentYear));
        }
        else{
            result = (fV * currencyEx)/(1 + percentage*percentYear);
        }
    }
    else if (isNaN(fV)){
        if (compound){
            result = pV*currencyEx*Math.pow((1+percentage/capitalization), (capitalization*percentYear));
        }
        else{
            result = pV*currencyEx*(1+percentage*percentYear);
        }
    }
    else if (isNaN(percentage)){
        if (compound){
            let tmp = 1/(percentYear*capitalization);
            result = Math.pow(((fV*currencyEx)/pV), tmp)*capitalization - capitalization;
        }
        else {
            result = ((fV*currencyEx)/pV)/percentYear - 1/percentYear;
        }
    }
    if (isNaN(pV)){
        element.innerHTML = "PV = " + (Math.round((result + Number.EPSILON) * 10000) / 10000);
    }
    else if (isNaN(fV)){
        element.innerHTML = "FV = " + (Math.round((result + Number.EPSILON) * 10000) / 10000);
    }
    else if (isNaN(percentage)){
        element.innerHTML = "i = " + (Math.round((result + Number.EPSILON) * 10000) / 10000) + "%";
    }
    else {
        element.innerHTML = result;
    }
}

function capitalCost(){
    var debtRate = parseFloat(document.getElementById("debtRate").value)/100;
    var taxRate = parseFloat(document.getElementById("taxRate").value)/100;

    var diviperStock = parseFloat(document.getElementById("diviperStock").value);
    var stockPriceU = parseFloat(document.getElementById("stockPriceU").value);
    var emissionCost = parseFloat(document.getElementById("emissionCost").value);

    var diviYear0 = parseFloat(document.getElementById("diviYear0").value);
    var diviYear1 = parseFloat(document.getElementById("diviYear1").value);
    var stockPriceZ = parseFloat(document.getElementById("stockPriceZ").value);
    var gRate = parseFloat(document.getElementById("gRate").value)/100;

    var beta = parseFloat(document.getElementById("beta").value);
    var noRisk = parseFloat(document.getElementById("noRisk").value)/100;
    var walletRate = parseFloat(document.getElementById("walletRate").value)/100;

    var stockUpercent = parseFloat(document.getElementById("stockUpercent").value);
    var stockZpercent = parseFloat(document.getElementById("stockZpercent").value);
    var foreignCpercent = parseFloat(document.getElementById("foreignCpercent").value);

    var debtResult = document.getElementById("debtResult");
    var stockUResult = document.getElementById("stockUResult");
    var stockZResult = document.getElementById("stockZResult");
    var capmResult = document.getElementById("capmResult");
    var waccResult = document.getElementById("waccResult");

    var debtResulto;
    var stockUResulto;
    var stockZResulto;
    var capmResulto;
    var waccResulto;

    var debt = true;
    var stockU = true;
    var stockZ = true;
    var capm = true;
    var wacc = true;

    if (isNaN(debtRate)){
        debt = false;
    }
    if (isNaN(stockPriceU)){
        stockU = false;
    }
    if (isNaN(stockPriceZ)){
        stockZ = false;
    }
    if (isNaN(beta)){
        capm = false;
    }
    if (isNaN(stockUpercent) && isNaN(stockZpercent) && isNaN(foreignCpercent)){
        wacc = false;
    }

    if (debt){
       debtResulto = debtRate*(1-taxRate);
    }
    if (stockU){
        stockUResulto = diviperStock/(stockPriceU - emissionCost);
    }
    if (stockZ){
        if (isNaN(diviYear1)){
            stockZResulto = (diviYear0 * (1 + gRate))/stockPriceZ + gRate;
        }
        else {
            stockZResulto = diviYear1/stockPriceZ + gRate;
        }
    }
    if (capm){
        capmResulto = noRisk + beta*(walletRate - noRisk);
    }
    if (wacc){
        if (isNaN(stockUpercent)){
            if (isNaN(stockZpercent)){
                if (isNaN(foreignCpercent)){
                    waccResulto = 0;
                }
                else{
                    waccResulto = foreignCpercent*debtResulto;
                }
            }
            else{
                if (isNaN(foreignCpercent) && (stockZ) && (capm)){
                    waccResulto = stockZpercent * (stockZResulto + capmResulto);
                }
                else if (isNaN(foreignCpercent) && (stockZ)){
                    waccResulto = stockZpercent * stockZResulto;
                }
                else if (isNaN(foreignCpercent) && (capm)){
                    waccResulto = stockZpercent * capmResulto;
                }
                else if ((stockZ) && (capm)){
                    waccResulto = stockZpercent * (stockZResulto + capmResulto) + foreignCpercent*debtResulto;
                }
                else if(stockZ){
                    waccResulto = stockZpercent * stockZResulto + foreignCpercent*debtResulto;
                }
                else{
                    waccResulto = stockZpercent * capmResulto + foreignCpercent*debtResulto;
                }
            }
        }
        else{
            if (isNaN(stockZpercent)){
                if (isNaN(foreignCpercent)){
                    waccResulto = stockUpercent * stockUResulto;
                }
                else{
                    waccResulto = stockUpercent * stockUResulto + foreignCpercent*debtResulto;
                }
            }
            else{
                if (isNaN(foreignCpercent)){
                    if (stockZ){
                        if (capm){
                            waccResulto = stockUpercent * stockUResulto + stockZpercent*(capmResulto+stockZResulto);
                        }
                        else{
                            waccResulto = stockUpercent * stockUResulto + stockZpercent*stockZResulto;
                        }
                    }
                    else{
                        waccResulto = stockUpercent * stockUResulto + capmResulto*stockZpercent;
                    }
                }
                else{
                    if (stockZ){
                        if (capm){
                            waccResulto = stockUpercent * stockUResulto +stockZpercent*(capmResulto+stockZResulto) + foreignCpercent*debtResulto;
                        }
                        else{
                            waccResulto = stockUpercent * stockUResulto + stockZpercent*stockZResulto + foreignCpercent*debtResulto;
                        }
                    }
                    else{
                        if (capm){
                            waccResulto =  stockUpercent * stockUResulto + capmResulto *stockZpercent + foreignCpercent*debtResulto;
                        }
                        else{
                            waccResulto = 0;
                        }
                    }
                }
            }
        }
    }
    if (debt){
        debtResult.innerHTML = "Koszt kapitału obcego = " + debtResulto*100 + "%";
    }
    else{
        debtResult.innerHTML = "Kd = Brak danych.";
    }
    if (stockU){
        stockUResult.innerHTML = "Koszt akcji uprzyw. = " + stockUResulto*100 + "%";
    }
    else{
        stockUResult.innerHTML = "Ku = Brak danych.";
    }
    if (stockZ){
        stockZResult.innerHTML = "Koszt akcji zwykłych = " + stockZResulto*100 + "%";
    }
    else{
        stockZResult.innerHTML = "Kz = Brak danych.";
    }
    if (capm){
        capmResult.innerHTML = "CAPM = " + capmResulto*100 + "%";
    }
    else{
        capmResult.innerHTML = "CAPM = Brak danych";
    }
    if (wacc){
        waccResult.innerHTML = "WACC = " + waccResulto + "%";
    }
    else{
        waccResult.innerHTML = "WACC = Brak danych.";
    }
}

function npvCountYears(){
    var year = parseInt(document.getElementById("yearNumberNPV").value, 10);
    var years = new Array(10);
    var obligatory = document.getElementById("obligatoryNpv");
    var investSale = document.getElementById("invSale");
    years[0] = document.getElementById("rok0");
    years[1] = document.getElementById("rok1");
    years[2] = document.getElementById("rok2");
    years[3] = document.getElementById("rok3");
    years[4] = document.getElementById("rok4");
    years[5] = document.getElementById("rok5");
    years[6] = document.getElementById("rok6");
    years[7] = document.getElementById("rok7");
    years[8] = document.getElementById("rok8");
    years[9] = document.getElementById("rok9");
    if (year > 0){
        obligatory.style.display = "block";
        investSale.style.display = "block";
    }
    // ME from the future - make it hide unnecessary years
    for (var i = 0; i <= year; i++){
        years[i].style.display = "block";
    }
}

function npvCountAll(){

    var discount = parseFloat(document.getElementById("discount").value)/100;
    var reinvest = parseFloat(document.getElementById("reinvest").value)/100;
    var tax = 1 - parseFloat(document.getElementById("tax").value)/100;

    var years = new Array(10);
    var currency = new Array(10);
    var effects = new Array(10);

    var investSale = parseFloat(document.getElementById("investSale").value);

    var noMirr = false;

    years[0] = parseFloat(document.getElementById("year0").value);
    years[1] = parseFloat(document.getElementById("year1").value);
    years[2] = parseFloat(document.getElementById("year2").value);
    years[3] = parseFloat(document.getElementById("year3").value);
    years[4] = parseFloat(document.getElementById("year4").value);
    years[5] = parseFloat(document.getElementById("year5").value);
    years[6] = parseFloat(document.getElementById("year6").value);
    years[7] = parseFloat(document.getElementById("year7").value);
    years[8] = parseFloat(document.getElementById("year8").value);
    years[9] = parseFloat(document.getElementById("year9").value);

    currency[0] = parseFloat(document.getElementById("curr0").value);
    currency[1] = parseFloat(document.getElementById("curr1").value);
    currency[2] = parseFloat(document.getElementById("curr2").value);
    currency[3] = parseFloat(document.getElementById("curr3").value);
    currency[4] = parseFloat(document.getElementById("curr4").value);
    currency[5] = parseFloat(document.getElementById("curr5").value);
    currency[6] = parseFloat(document.getElementById("curr6").value);
    currency[7] = parseFloat(document.getElementById("curr7").value);
    currency[8] = parseFloat(document.getElementById("curr8").value);
    currency[9] = parseFloat(document.getElementById("curr9").value);

    effects[0] = 0;
    effects[1] = parseFloat(document.getElementById("effect1").value);
    effects[2] = parseFloat(document.getElementById("effect1").value);
    effects[3] = parseFloat(document.getElementById("effect1").value);
    effects[4] = parseFloat(document.getElementById("effect1").value);
    effects[5] = parseFloat(document.getElementById("effect1").value);
    effects[6] = parseFloat(document.getElementById("effect1").value);
    effects[7] = parseFloat(document.getElementById("effect1").value);
    effects[8] = parseFloat(document.getElementById("effect1").value);
    effects[9] = parseFloat(document.getElementById("effect1").value);

    var counter = 0;
    for (let i = 0; i < 10; i++){
        if (isNaN(years[i])){
            break;
        }
        counter = i;
    }

    // Get rid of NaN where it matters
    for (let m = 0; m <= counter; m++){
        if (isNaN(currency[m])){
            currency[m] = 1;
        }
        if (isNaN(effects[m])){
            effects[m] = 0;
        }
    }

    if (!isNaN(investSale)){
        years[counter] = years[counter] + investSale;
    }
    if (isNaN(tax)){
        tax = 1;
    }
    if (isNaN(reinvest)){
        noMirr = true;
    }

    // Payback
    var paybackYear = 0;
    var paybackMonth = 0;
    var tmp1 = 0;
    var tmp2 = 0;
    var baseValue = years[0]/currency[0];
    var noPayback = false;
    for (let j = 1; j <= counter; j++){
        tmp1 = tmp1 + ((tax*years[j]-effects[j])/(currency[j] * Math.pow(1+discount, j)));
        if (baseValue - tmp1 > 0){
            paybackYear = paybackYear + 1;
        }
        else{
            tmp1 = tmp1 - tmp2;
            paybackMonth = Math.ceil(((baseValue - tmp2)/tmp1)*12);
            if (paybackMonth == 12){
                paybackMonth = 0;
                paybackYear = paybackYear + 1;
            }
            break;
        }
        tmp2 = tmp1;
        if (j == counter){
            noPayback = true;
        }
    }

    // NPV
    var npv = -years[0];
    for (let h = 1; h <= counter; h++){
        npv = npv + ((tax*years[h]-effects[h])/(currency[h] * Math.pow(1+discount, h)));
    }

    // MIRR
    var mirr = 0;
    if (!noMirr){
        let mirrUp = 0;
        let mirrDown = years[0]/currency[0];
        for (let g = 1; g <= counter; g++){
            if (years[g] > 0){
                mirrUp = mirrUp + (years[g]*tax/currency[g])*Math.pow(1+reinvest, counter-g);
            }
            else{
                mirrDown = mirrDown + (years[g]*tax/(currency[g]*Math.pow(1+discount), g));
            }
        }
        mirr = Math.pow(mirrUp/mirrDown, 1/counter) - 1;
    }

    var netPV = document.getElementById("netPV");
    var payback = document.getElementById("payback");
    var mirrResult = document.getElementById("mirrResult");

    if (noPayback){
        payback.innerHTML = "Inwestycja się nie zwróci."
    }
    else{
        payback.innerHTML = "Zdyskont. okres zwrotu to " + paybackYear +" l. " + paybackMonth +" m.";
    }
    netPV.innerHTML = "NPV = " + npv;
    if (noMirr){
        mirrResult.innerHTML = "Brak danych do obliczenia MIRR."
    }
    else{
        mirrResult.innerHTML = "MIRR = " + mirr*100 + "%";
    }
}









