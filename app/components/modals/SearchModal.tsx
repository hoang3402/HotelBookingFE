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

enum STEPS {
  LOCATION = 0,
  DATE = 1,
  INFO = 2,
}

const SearchModal = () => {
  const router = useRouter();
  const searchModal = useSearchModal();
  const params = useSearchParams();

  const [step, setStep] = useState(STEPS.LOCATION);

  const [country, setCountry] = useState<any>();
  const [province, setProvince] = useState<any>();
  const [city, setCity] = useState<any>();
  const [guestCount, setGuestCount] = useState(1);
  const [roomCount, setRoomCount] = useState(1);
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
        locationValue: country?.code,
        guestCount,
        roomCount,
      };

      if (dateRange.startDate) {
        // updatedQuery.startDate = formatISO(dateRange.startDate);
        updatedQuery.startDate = dateRange.startDate.toISOString().split('T')[0];
      }

      if (dateRange.endDate) {
        // updatedQuery.endDate = formatISO(dateRange.endDate);
        updatedQuery.endDate = dateRange.endDate.toISOString().split('T')[0];
      }

      const url = qs.stringifyUrl({
        url: '/',
        query: updatedQuery,
      }, {skipNull: true});

      setStep(STEPS.LOCATION);
      searchModal.onClose();
      router.push(url);
    },
    [
      step,
      searchModal,
      country,
      router,
      guestCount,
      roomCount,
      dateRange,
      onNext,
      params
    ]);

  const actionLabel = useMemo(() => {
    if (step === STEPS.INFO) {
      return 'Search'
    }

    return 'Next'
  }, [step]);

  const secondaryActionLabel = useMemo(() => {
    if (step === STEPS.LOCATION) {
      return undefined
    }

    return 'Back'
  }, [step]);

  let bodyContent = (
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
          onChange={(value) => setGuestCount(value)}
          value={guestCount}
          title="Guests"
          subtitle="How many guests are coming?"
        />
        <hr/>
        <Counter
          onChange={(value) => setRoomCount(value)}
          value={roomCount}
          title="Rooms"
          subtitle="How many rooms do you need?"
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
      secondaryAction={step === STEPS.LOCATION ? undefined : onBack}
      onClose={searchModal.onClose}
      body={bodyContent}
    />
  );
}

export default SearchModal;
