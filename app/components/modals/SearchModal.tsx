'use client';

import qs from 'query-string';
import React, {useCallback, useMemo, useState} from "react";
import {Range} from 'react-date-range';
import {useRouter, useSearchParams} from 'next/navigation';
import useSearchModal from "@/app/hooks/useSearchModal";

import Modal from "./Modal";
import Calendar from "../inputs/Calendar";
import Counter from "../inputs/Counter";
import CountrySelect from "../inputs/CountrySelect";
import Heading from '../Heading';
import {City, Country, Province} from "@/app/type";

enum STEPS {
  KEYWORD = 0,
  LOCATION = 1,
  DATE = 2,
  INFO = 3,
}

const SearchModal = () => {
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useSearchParams();

  const [step, setStep] = useState(STEPS.KEYWORD);

  const [keyword, setKeyword] = useState<string>();
  const [country, setCountry] = useState<Country>();
  const [province, setProvince] = useState<Province>();
  const [city, setCity] = useState<City>();
  const [adultsCount, setAdultsCount] = useState(1);
  const [childrenCount, setChildrenCount] = useState(0);
  const [dateRange, setDateRange] = useState<Range>({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });

  const onBack = useCallback(() => {
    setStep((value) => value - 1);
  }, []);

  const onNext = useCallback(() => {
    setStep((value) => value + 1);
  }, []);

  const onSubmit = useCallback(async () => {
      if (step !== STEPS.INFO) {
        return onNext();
      }

      let currentQuery = {};

      if (params) {
        currentQuery = qs.parse(params.toString())
      }

      const updatedQuery: any = {
        ...currentQuery,
        country: country?.code,
        adultsCount,
        childrenCount,
      };

      if (keyword) {
        updatedQuery.keyword = keyword
      }

      if (dateRange.startDate) {
        // updatedQuery.startDate = formatISO(dateRange.startDate);
        updatedQuery.startDate = dateRange.startDate.toISOString().split('T')[0];
      }

      if (dateRange.endDate) {
        // updatedQuery.endDate = formatISO(dateRange.endDate);
        updatedQuery.endDate = dateRange.endDate.toISOString().split('T')[0];
      }

      if (province) {
        updatedQuery.province = province.id
      }

      if (city) {
        updatedQuery.city = city.code
      }

      const url = qs.stringifyUrl({
        url: '/',
        query: updatedQuery,
      }, {skipNull: true});

      setStep(STEPS.KEYWORD);
      searchModal.onClose();
      router.push(url);
    },
    [
      step,
      params,
      country?.code,
      adultsCount,
      childrenCount,
      keyword,
      dateRange.startDate,
      dateRange.endDate,
      province,
      city,
      searchModal,
      router,
      onNext
    ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Search'
    }

    return 'Next'
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.KEYWORD) {
      return undefined
    }

    return 'Back'
  }, [step]);

  let bodyContent = (
    <div>
      <Heading
        title="What are you looking for?"
        subtitle="Find your perfect place!"
      />
      <input
        type="text"
        placeholder="Keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="w-full p-4 text-lg font-light rounded-md border mt-2"
      />
    </div>
  )

  if (step === STEPS.LOCATION) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="Where do you wanna go?"
          subtitle="Find the perfect location!"
        />
        <CountrySelect
          valueCountry={country}
          onChangeCountry={(value) =>
            setCountry(value)}
          valueProvince={province}
          onChangeProvince={(value) =>
            setProvince(value)}
          valueCity={city}
          onChangeCity={(value) =>
            setCity(value)}
        />
      </div>
    )
  }

  if (step === STEPS.DATE) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="When do you plan to go?"
          subtitle="Make sure everyone is free!"
        />
        <Calendar
          onChange={(value) => setDateRange(value.selection)}
          value={dateRange}
        />
      </div>
    )
  }

  if (step === STEPS.INFO) {
    bodyContent = (
      <div className="flex flex-col gap-8">
        <Heading
          title="More information"
          subtitle="Find your perfect place!"
        />
        <Counter
          onChange={(value) => setAdultsCount(value)}
          value={adultsCount}
          title="Adults"
          subtitle="Ages 18 or above"
        />
        <hr/>
        <Counter
          onChange={(value) => setChildrenCount(value)}
          value={childrenCount}
          title="Children"
          subtitle="Ages 0-17"
        />
      </div>
    )
  }

  return (
    <Modal
      isOpen={searchModal.isOpen}
      title="Filters"
      actionLabel={actionLabel}
      onSubmit={onSubmit}
      secondaryActionLabel={secondaryActionLabel}
      secondaryAction={step === STEPS.KEYWORD ? undefined : onBack}
      onClose={searchModal.onClose}
      body={bodyContent}
    />
  );
}

export default SearchModal;
