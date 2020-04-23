from flask import Flask, render_template, request
import math

yearNumber = 0

app = Flask(__name__)
@app.route("/")
def index():
    return render_template("index.html")

@app.route("/kombajn")
def kombajn():
    return render_template("kombajn.html")

@app.route("/kombajnPC")
def kombajnPC():
    return render_template("kombajnPC.html")

@app.route("/capitalcost")
def capitalcost():
    return render_template("capitalcost.html")

@app.route("/resultcapital")
def countcapital():
    # Foreign capital
    tmp = request.args.get("debtRate", type=float)
    if tmp is not None:
        debtRate = tmp/100
        forcap = 1
    else:
        debtRate = 0
        forcap = 0
    tmp = request.args.get("taxRate", type=float)
    if tmp is not None:
        taxRate = tmp/100
    else:
        taxRate = 0

    # Privileged stock
    tmp = request.args.get("diviperStock", type=float)
    if tmp is not None:
        diviperStock = tmp
        privst = 1
    else:
        diviperStock = 0
        privst = 0
    tmp = request.args.get("stockPriceU", type=float)
    if tmp is not None:
        stockPriceU = tmp
    else:
        stockPriceU = 1
    tmp = request.args.get("emissionCost", type=float)
    if tmp is not None:
        emissionCost = tmp/100
    else:
        emissionCost = 0

    # Ordinary stock
    tmp = request.args.get("diviYear0", type=float)
    if tmp is not None:
        diviYear0 = tmp
        ordst = 1
    else:
        diviYear0 = 0
    tmp = request.args.get("diviYear1", type=float)
    if tmp is not None:
        diviYear1 = tmp
        ordst = 2
    else:
        diviYear1 = 0
    tmp = request.args.get("stockPriceZ", type=float)
    if tmp is not None:
        stockPriceZ = tmp
    else:
        stockPriceZ = 1
        ordst = 0
    tmp = request.args.get("gRate", type=float)
    if tmp is not None:
        gRate = tmp/100
    else:
        gRate = 0

    # CAPM
    tmp = request.args.get("beta", type=float)
    if tmp is not None:
        beta = tmp
        cap = 1
    else:
        beta = 0
        cap = 0
    tmp = request.args.get("noRisk", type=float)
    if tmp is not None:
        noRisk = tmp/100
    else:
        noRisk = 0
    tmp = request.args.get("walletRate", type=float)
    if tmp is not None:
        walletRate = tmp/100
    else:
        walletRate = 0

    # WACC
    tmp = request.args.get("stockUpercent", type=float)
    if tmp is not None:
        stockUpercent = tmp/100
        wac = 1
    else:
        stockUpercent = 0
    tmp = request.args.get("stockZpercent", type=float)
    if tmp is not None:
        stockZpercent = tmp/100
        wac = 1
    else:
        stockZpercent = 0
    tmp = request.args.get("foreignCpercent", type=float)
    if tmp is not None:
        foreignCpercent = tmp/100
        wac = 1
    else:
        foreignCpercent = 0
        wac = 0



    # Count Foreign Capital
    fcCost = (debtRate*(1-taxRate))

    # Count Privileged Stock
    privStock = diviperStock/(stockPriceU - stockPriceU*emissionCost)

    # Count Ordinary Stock
    ordStock0 = (diviYear0*(1+gRate))/stockPriceZ + gRate
    ordStock1 = diviYear1/stockPriceZ + gRate

    # CAPM
    capm = noRisk + beta*(walletRate - noRisk)

    # WACC
    if cap == 1:
        wacc = stockUpercent * privStock + stockZpercent * capm + foreignCpercent * fcCost
    elif ordst == 1:
        wacc = stockUpercent * privStock + stockZpercent * ordStock0 + foreignCpercent * fcCost
    else:
        wacc = stockUpercent * privStock + stockZpercent * ordStock1 + foreignCpercent * fcCost

    fcCost = fcCost*100
    privStock = privStock*100
    ordStock0 = ordStock0*100
    ordStock1 = ordStock1*100
    capm = capm*100
    wacc = wacc*100

    return render_template("resultcapital.html", fcCost=fcCost, privStock=privStock, ordStock0=ordStock0, ordStock1=ordStock1,
            capm=capm, wacc=wacc, forcap=forcap, privst=privst, cap=cap, ordst=ordst, wac=wac)

@app.route("/percent")
def percent():
    return render_template("percent.html")

@app.route("/resultpercent")
def resultpercent():
    tmp = request.args.get("percentYear", type=float)
    if tmp is not None:
        percentYear = tmp
    else:
        percentYear = 0
    tmp = request.args.get("presentValue", type=float)
    if tmp is not None:
        presentValue = tmp
    else:
        presentValue = -100
        mode = 0 # Indicates that PV is to be found
    tmp = request.args.get("futureValue", type=float)
    if tmp is not None:
        futureValue = tmp
    else:
        futureValue = -100
        mode = 1 # Indicates that FV is to be found
    tmp = request.args.get("percentage", type=float)
    if tmp is not None:
        percentage = tmp/100
    else:
        percentage = -100
        mode = 2 # Indicates that interest rate is to be found
    tmp = request.args.get("capitalization", type=int)
    if tmp is not None and tmp > 0:
        capitalization = tmp
        compoundinterest = 1
    else:
        capitalization = 1
        compoundinterest = 0 # It's not compound interest
    tmp = request.args.get("forwardex", type=float)
    if tmp is not None and tmp > 0:
        forwardex = tmp
    else:
        forwardex = 1

    # Currency rate of credit
    tmp = request.args.get("percenta", type=float)
    if tmp is not None:
        percenta = tmp/100
        mode = 3
    else:
        percenta = 0
    tmp = request.args.get("spotex", type=float)
    if tmp is not None:
        spotex = tmp/100
    else:
        noRisk = 1
    tmp = request.args.get("forward2", type=float)
    if tmp is not None:
        forward2 = tmp/100
    else:
        forward2 = 0

    # Mode 0 - discounting
    if mode == 0:
        if compoundinterest == 0:
            presentValue = ((futureValue*forwardex))/(1+percentage*percentYear)
        else:
            presentValue = ((futureValue*forwardex))/((1+percentage/capitalization)**(percentYear*capitalization))

    # Mode 1 - counting FV
    if mode == 1:
        if compoundinterest == 0:
            futureValue = (forwardex*presentValue)*(1+percentage*percentYear)
        else:
            futureValue = (forwardex*presentValue)*((1+percentage/capitalization)**(percentYear*capitalization))

    # Mode 2 - looking for interest rate
    if mode == 2:
        if compoundinterest == 0:
            percentage = ((futureValue*forwardex)/((presentValue)*percentYear) - 1)
        else:
            percentage = ((((futureValue*forwardex)/(presentValue))**(1/(percentYear*capitalization)))*capitalization - capitalization)

    # Mode 3 - looking for currency rate of credit
    if mode == 3:
        percentage = (1 + percenta) * (1 + (forward2 - spotex)/spotex) - 1
    percentage = percentage*100
    return render_template("resultpercent.html", presentValue=presentValue, futureValue=futureValue, percentage=percentage, mode=mode)

# d

@app.route("/npv")
def netpresentvalue():
    yearNumber = request.args.get("yearNumber", type=int)
    if not yearNumber:
        return render_template("npv.html", yearNumber = 0)
    return render_template("npv.html", yearNumber=yearNumber)

@app.route("/resultnpv")
def count():
    error = False
    year = [None] * 11
    currency = [None] * 11
    effect = [None] * 11
    counter = 0  # Needed to indicate the year when investment is sold

    # Look for all the variables needed
    tmp = request.args.get("year0", type=float)
    if tmp is not None:
        year[0] = tmp
    else:
        year[0] = 0
        error = True
    tmp = request.args.get("year1", type=float)
    if tmp is not None:
        year[1] = tmp
        counter += 1
    else:
        year[1] = 0
    tmp = request.args.get("year2", type=float)
    if tmp is not None:
        year[2] = tmp
        counter += 1
    else:
        year[2] = 0
    tmp = request.args.get("year3", type=float)
    if tmp is not None:
        year[3] = tmp
        counter += 1
    else:
        year[3] = 0
    tmp = request.args.get("year4", type=float)
    if tmp is not None:
        year[4] = tmp
        counter += 1
    else:
        year[4] = 0
    tmp = request.args.get("year5", type=float)
    if tmp is not None:
        year[5] = tmp
        counter += 1
    else:
        year[5] = 0
    tmp = request.args.get("year6", type=float)
    if tmp is not None:
        year[6] = tmp
        counter += 1
    else:
        year[6] = 0
    tmp = request.args.get("year7", type=float)
    if tmp is not None:
        year[7] = tmp
        counter += 1
    else:
        year[7] = 0
    tmp = request.args.get("year8", type=float)
    if tmp is not None:
        year[8] = tmp
        counter += 1
    else:
        year[8] = 0
    tmp = request.args.get("year9", type=float)
    if tmp is not None:
        year[9] = tmp
        counter += 1
    else:
        year[9] = 0

    # This one is actually for the sale of finished investment
    tmp = request.args.get("investSale", type=float)
    if tmp is not None:
        year[10] = tmp
    else:
        year[10] = 0

    # Include currency exchange rate
    tmp = request.args.get("curr0", type=float)
    if tmp is not None:
        currency[0] = tmp
    else:
        currency[0] = 1
    tmp = request.args.get("curr1", type=float)
    if tmp is not None:
        currency[1] = tmp
    else:
        currency[1] = 1
    tmp = request.args.get("curr2", type=float)
    if tmp is not None:
        currency[2] = tmp
    else:
        currency[2] = 1
    tmp = request.args.get("curr3", type=float)
    if tmp is not None:
        currency[3] = tmp
    else:
        currency[3] = 1
    tmp = request.args.get("curr4", type=float)
    if tmp is not None:
        currency[4] = tmp
    else:
        currency[4] = 1
    tmp = request.args.get("curr5", type=float)
    if tmp is not None:
        currency[5] = tmp
    else:
        currency[5] = 1
    tmp = request.args.get("curr6", type=float)
    if tmp is not None:
        currency[6] = tmp
    else:
        currency[6] = 1
    tmp = request.args.get("curr7", type=float)
    if tmp is not None:
        currency[7] = tmp
    else:
        currency[7] = 1
    tmp = request.args.get("curr8", type=float)
    if tmp is not None:
        currency[8] = tmp
    else:
        currency[8] = 1
    tmp = request.args.get("curr9", type=float)
    if tmp is not None:
        currency[9] = tmp
    else:
        currency[9] = 1
    tmp = request.args.get("curr10", type=float)
    if tmp is not None:
        currency[10] = tmp
    else:
        currency[10] = 1

    # Additional effects
    tmp = request.args.get("effect1", type=float)
    if tmp is not None:
        effect[0] = tmp
    else:
        effect[0] = 0
    tmp = request.args.get("effect2", type=float)
    if tmp is not None:
        effect[1] = tmp
    else:
        effect[1] = 0
    tmp = request.args.get("effect3", type=float)
    if tmp is not None:
        effect[2] = tmp
    else:
        effect[2] = 0
    tmp = request.args.get("effect4", type=float)
    if tmp is not None:
        effect[3] = tmp
    else:
        effect[3] = 0
    tmp = request.args.get("effect5", type=float)
    if tmp is not None:
        effect[4] = tmp
    else:
        effect[4] = 0
    tmp = request.args.get("effect6", type=float)
    if tmp is not None:
        effect[5] = tmp
    else:
        effect[5] = 0
    tmp = request.args.get("effect7", type=float)
    if tmp is not None:
        effect[6] = tmp
    else:
        effect[6] = 0
    tmp = request.args.get("effect8", type=float)
    if tmp is not None:
        effect[7] = tmp
    else:
        effect[7] = 0
    tmp = request.args.get("effect9", type=float)
    if tmp is not None:
        effect[8] = tmp
    else:
        effect[8] = 0
    effect[9] = 0
    effect[10] = 0

    tmp = request.args.get("discount", type=float)
    if tmp is not None:
        discount = tmp/100
    else:
        discount = 0
    tmp = request.args.get("tax", type=float)
    if tmp is not None:
        tax = 1 - tmp/100
    else:
        tax = 1
    tmp = request.args.get("reinvest", type=float)
    if tmp is not None:
        reinvest = tmp/100
        ismirr = True
    else:
        reinvest = 0
        ismirr = False

    # NPV
    npv = -(year[0] / currency[0])
    for cf in range(1, counter + 1):
        npv = npv + (year[cf]*tax+effect[cf-1])/(((1+discount)**cf)*currency[cf])
    npv = npv + (year[10]/(((1+discount)**counter)*currency[10])) * tax

    # MIRR
    mirrup = 0
    mirrdown = year[0]/currency[0]
    for mi in range(1, counter + 1):
        if year[mi] + effect[mi-1] >= 0:
            mirrup = mirrup +  ((tax*year[mi]+effect[mi-1])/currency[mi]) * ((1 + reinvest)**(counter - mi))
        else:
            mirrdown = mirrdown - ((year[mi]+effect[mi-1])/(currency[mi] * (1 + discount)**mi))
    mirrup = mirrup + tax * (year[10]/currency[10])
    if mirrdown != 0:
        mirr = mirrup/mirrdown
    else:
        mirr = 0
    if counter != 0:
        mirr = ((mirr**(1/counter)) - 1) * 100

    # Return
    returnyear = 0
    returnmonth = 0
    returntemp1 = 0
    returntemp2 = 0
    if error is not True:
        year[counter] = year[counter] + year[10]
        for ret in range(1,11):
            returntemp1 = returntemp1 + (year[ret]*tax+effect[ret-1])/(((1+discount)**ret)*currency[ret])
            if returntemp1 < (year[0]/currency[0]) and ret != 10:
                returnyear += 1
            elif returntemp1 < (year[0]/currency[0]) and ret == 10:
                returnmonth = 100
            else:
                returnmonth = math.ceil(12*(((year[0]/currency[0]) - returntemp2)/((year[ret]*tax+effect[ret-1])/(((1+discount)**ret)*currency[ret]))))
                if returnmonth == 12:
                    returnyear += 1
                    returnmonth = 0
                break
            returntemp2 = returntemp1
    if error is not True:
        return render_template("resultnpv.html", npv=npv, returnyear=returnyear, returnmonth=returnmonth, mirr=mirr, ismirr=ismirr)
    else:
        return render_template("error.html")