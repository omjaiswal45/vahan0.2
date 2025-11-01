import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../store/store';
import {
  setVehicleNumber,
  clearVehicleNumber,
  skipVehicleNumber,
  resetSkipStatus,
} from '../store/slices/vehicleSlice';

export const useVehicleNumber = () => {
  const dispatch = useDispatch();
  const vehicleState = useSelector((state: RootState) => state.vehicle);

  const saveVehicleNumber = (number: string) => {
    dispatch(setVehicleNumber(number));
  };

  const removeVehicleNumber = () => {
    dispatch(clearVehicleNumber());
  };

  const skipForNow = () => {
    dispatch(skipVehicleNumber());
  };

  const resetSkip = () => {
    dispatch(resetSkipStatus());
  };

  const validateVehicleNumber = (number: string): boolean => {
    // Indian vehicle registration format: XX00XX0000 or XX00XXX0000
    const regex = /^[A-Z]{2}[0-9]{1,2}[A-Z]{1,3}[0-9]{4}$/;
    return regex.test(number.toUpperCase());
  };

  const formatVehicleNumber = (number: string): string => {
    // Format as XX00XX0000 with proper spacing
    const cleaned = number.replace(/\s/g, '').toUpperCase();
    if (cleaned.length <= 4) return cleaned;
    if (cleaned.length <= 6) return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 6)} ${cleaned.slice(6)}`;
  };

  const shouldShowModal = (): boolean => {
    // Show modal if vehicle number is not set and user hasn't skipped
    return !vehicleState.isVehicleNumberSet && !vehicleState.hasSkipped;
  };

  return {
    vehicleNumber: vehicleState.vehicleNumber,
    isVehicleNumberSet: vehicleState.isVehicleNumberSet,
    hasSkipped: vehicleState.hasSkipped,
    saveVehicleNumber,
    removeVehicleNumber,
    skipForNow,
    resetSkip,
    validateVehicleNumber,
    formatVehicleNumber,
    shouldShowModal,
  };
};
