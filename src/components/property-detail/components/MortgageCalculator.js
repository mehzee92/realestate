"use client";
import React, { useEffect, useMemo, useState } from "react";
import H2 from "@/components/uis/h2";
import Headings from "@/components/uis/Headings";
import Input from "@/components/uis/Input";
import P from "@/components/uis/P";
import { FaCircle, FaChevronDown } from "react-icons/fa";

export default function MortgageCalculator({ property = {} }) {
  const parsePrice = (p) => {
    if (!p) return 0;
    if (typeof p.ListPrice === "number") return p.ListPrice;
    if (typeof p.ListPrice === "string") {
      const n = Number(p.ListPrice.replace(/[^0-9]/g, ""));
      return Number.isFinite(n) ? n : 0;
    }
    if (typeof p.price === "number") return p.price;
    if (typeof p.price === "string") {
      const n = Number(p.price.replace(/[^0-9]/g, ""));
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  };

  const initialPrice = parsePrice(property);

  const parseHoa = (p) => {
    if (!p) return 0;
    const a = p.AssociationFee ?? p.hoa ?? 0;
    if (typeof a === "number") return a;
    if (typeof a === "string") {
      const n = Number(a.replace(/[^0-9]/g, ""));
      return Number.isFinite(n) ? n : 0;
    }
    return 0;
  };
  const initialHoa = parseHoa(property);

  const [homePrice, setHomePrice] = useState(initialPrice);
  const [interestRate, setInterestRate] = useState(0.07);
  const [loanTermYears, setLoanTermYears] = useState(30);
  const [downPaymentPercent, setDownPaymentPercent] = useState(20);
  const [isDownPaymentOpen, setIsDownPaymentOpen] = useState(false);
  const [isLoanDetailsOpen, setIsLoanDetailsOpen] = useState(false);
  const [isPropertyTaxOpen, setIsPropertyTaxOpen] = useState(false);
  const [isHoaOpen, setIsHoaOpen] = useState(false);

  useEffect(() => {
    setHomePrice(initialPrice);
  }, [initialPrice]);

  const propertyTaxRate = useMemo(() => {
    if (property.TaxAnnualAmount && initialPrice > 0) {
      return property.TaxAnnualAmount / initialPrice;
    }
    return 0.0095; // fallback
  }, [property.TaxAnnualAmount, initialPrice]);

  const hoaFees = initialHoa;

  const downPaymentAmount = useMemo(
    () => (homePrice * (downPaymentPercent / 100 || 0)),
    [homePrice, downPaymentPercent]
  );

  const loanAmount = useMemo(() => Math.max(homePrice - downPaymentAmount, 0), [
    homePrice,
    downPaymentAmount,
  ]);

  const monthlyInterestRate = interestRate / 12;
  const numberOfPayments = loanTermYears * 12;

  const monthlyPrincipalInterest = useMemo(() => {
    if (loanAmount <= 0 || monthlyInterestRate <= 0 || numberOfPayments <= 0) return 0;
    const r = monthlyInterestRate;
    const n = numberOfPayments;
    const p = loanAmount;
    const payment = (p * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Number.isFinite(payment) ? payment : 0;
  }, [loanAmount, monthlyInterestRate, numberOfPayments]);

  const monthlyPropertyTax = useMemo(() => (homePrice * propertyTaxRate) / 12, [homePrice, propertyTaxRate]);

  const totalMonthly = monthlyPrincipalInterest + monthlyPropertyTax + hoaFees;

  const principalPercent = totalMonthly > 0 ? (monthlyPrincipalInterest / totalMonthly) * 100 : 0;
  const taxPercent = totalMonthly > 0 ? (monthlyPropertyTax / totalMonthly) * 100 : 0;
  const hoaPercent = totalMonthly > 0 ? (hoaFees / totalMonthly) * 100 : 0;

  const fmt = (n, digits = 0) =>
    typeof n === "number" ? n.toLocaleString(undefined, { maximumFractionDigits: digits }) : n;

  return (
    <div className="mt-5 mx-auto bg-white ">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Mortgage Calculator</h2>

      <div className="flex flex-col justify-between gap-2">
        <Headings text={<>{`$${fmt(totalMonthly, 0)}/mo`}</>} />
        <P text={`Est. mortgage payment based on a $${fmt(homePrice)} home price.`} />

        <div className="relative group">
          <div className="absolute -top-32 right-0 bg-white shadow-lg border rounded-lg p-4 w-72 opacity-0 group-hover:opacity-100 transition-opacity z-10">
            <p className="text-lg font-semibold mb-2">Payments breakdown</p>

            <div className="flex justify-between text-base mb-1">
              <span className="flex items-center gap-2">
                <FaCircle className="text-black text-[8px]" />
                Principal & interest
              </span>
              <span>${fmt(monthlyPrincipalInterest, 0)} / mo</span>
            </div>

            <div className="flex justify-between text-base mb-1">
              <span className="flex items-center gap-2">
                <FaCircle className="text-gray-400 text-[8px]" />
                Property tax
              </span>
              <span>${fmt(monthlyPropertyTax, 2)} / mo</span>
            </div>

            <div className="flex justify-between text-base">
              <span className="flex items-center gap-2">
                <FaCircle className="text-gray-500 text-[8px]" />
                HOA fees
              </span>
              <span>${fmt(hoaFees, 0)} / mo</span>
            </div>
          </div>

          <div className="flex h-8 w-[98%] m-auto gap-1 rounded overflow-hidden">
            <div
              style={{ width: `${Math.max(0, principalPercent)}%` }}
              className="bg-black rounded-md transition-all duration-150"
            />
            <div
              style={{ width: `${Math.max(0, taxPercent)}%` }}
              className="bg-gray-400 rounded-md transition-all duration-150"
            />
            <div
              style={{ width: `${Math.max(0, hoaPercent)}%` }}
              className="bg-gray-500 rounded-md transition-all duration-150"
            />
          </div>
        </div>
      </div>

      <div
        className={`mt-6 border-b border-gray-400 pt-4 ${isDownPaymentOpen ? "border border-gray-400 p-3 rounded-2xl" : ""}`}>
        <button
          onClick={() => setIsDownPaymentOpen((s) => !s)}
          className="w-full cursor-pointer flex items-center justify-between text-left py-2"
        >
          <H2 text="Down payment" />
          <div className="flex items-center gap-2">
            {!isDownPaymentOpen && <P text={`$${fmt(downPaymentAmount, 0)} (${downPaymentPercent}%)`} />}
            <FaChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isDownPaymentOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        {isDownPaymentOpen && (
          <div className="px-2 pt-4">
            <P text="The amount that you plan to put down on the home. Increasing the down payment will lower your monthly mortgage." />
            <div className="flex items-center gap-3 mb-4">
              <span className="text-gray-500">$</span>
              <Input
                type="number"
                value={Math.round(downPaymentAmount)}
                onChange={(e) => {
                  const val = Number(e.target.value || 0);
                  const percent = homePrice ? (val / homePrice) * 100 : 0;
                  setDownPaymentPercent(Math.min(Math.max(percent, 0), 100));
                  
                }}
              />
              <Input
                type="number"
                value={Number(downPaymentPercent).toFixed(0)}
                onChange={(e) => {
                  const val = Number(e.target.value || 0);
                  setDownPaymentPercent(Math.min(Math.max(val, 0), 100));
                }}
              />
              <span className="text-gray-500">%</span>
            </div>

            <div className="relative z-10">
              <input
                type="range"
                min="0"
                max="99.5"
                step="0.1"
                value={downPaymentPercent}
                onChange={(e) => setDownPaymentPercent(Number(e.target.value || 0))}
                className="w-full accent-black"
              />
              <div className="absolute -z-10 top-2 w-full h-[2px] bg-gray-900" />
            </div>
          </div>
        )}
      </div>

      <div
        className={`mt-6 border-b border-gray-400 pt-4 ${isLoanDetailsOpen ? "border border-gray-400 p-3 rounded-2xl" : ""}`}>
        <button
          onClick={() => setIsLoanDetailsOpen((s) => !s)}
          className="w-full flex cursor-pointer items-center justify-between text-left py-2"
        >
          <H2 text="Loan details" />
          <div className="flex items-center gap-2">
            {!isLoanDetailsOpen && <P text={`${loanTermYears}-year fixed, ${(interestRate * 100).toFixed(1)}%`} />}
            <FaChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isLoanDetailsOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        {isLoanDetailsOpen && (
          <div className="px-2 pt-4">
            <P text="Typical mortgage loan details include the term and the interest rate. You can adjust them to see how it affects your monthly payment." />
            <div className="flex items-center gap-3 mb-4">
              <Input type="number" value={loanTermYears} onChange={(e) => setLoanTermYears(Number(e.target.value || 0))} />
              <span className="text-gray-500">years</span>
              <Input
                type="number"
                value={(interestRate * 100).toFixed(1)}
                onChange={(e) => setInterestRate(Number(e.target.value || 0) / 100)}
              />
              <span className="text-gray-500">%</span>
            </div>
          </div>
        )}
      </div>

      <div
        className={`mt-6 border-b border-gray-400 pt-4 ${isPropertyTaxOpen ? "border border-gray-400 p-3 rounded-2xl" : ""}`}>
        <button
          onClick={() => setIsPropertyTaxOpen((s) => !s)}
          className="w-full cursor-pointer flex items-center justify-between text-left py-2"
        >
          <H2 text="Property tax" />
          <div className="flex items-center gap-2">
            {!isPropertyTaxOpen && <P text={`$${fmt(monthlyPropertyTax, 2)} / month`} />}
            <FaChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isPropertyTaxOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        {isPropertyTaxOpen && (
          <div className="px-2 pt-4">
            <P text={`Estimated at ${(propertyTaxRate * 100).toFixed(2)}% yearly of the home price.`} />
            <P text={`$${fmt(homePrice * propertyTaxRate, 0)} annually`} />
          </div>
        )}
      </div>

      <div className={`mt-6 border-b border-gray-400 pt-4 ${isHoaOpen ? "border border-gray-400 p-3 rounded-2xl" : ""}`}>
        <button
          onClick={() => setIsHoaOpen((s) => !s)}
          className="w-full cursor-pointer flex items-center justify-between text-left py-2"
        >
          <H2 text="HOA fees" />
          <div className="flex items-center gap-2">
            {!isHoaOpen && <P text={hoaFees ? `$${fmt(hoaFees)}/month` : "--"} />}
            <FaChevronDown className={`h-5 w-5 text-gray-500 transition-transform ${isHoaOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        {isHoaOpen && <div className="px-2 pt-4">{hoaFees ? <P text="Monthly homeowners association fees are added to your payment." /> : <P text="No HOA fees for this property." />}</div>}
      </div>
    </div>
  );
}