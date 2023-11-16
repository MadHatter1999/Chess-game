import { ReportHandler, getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

const reportWebVitals = async (onPerfEntry?: ReportHandler) => {
  if (typeof onPerfEntry === 'function') {
    try {
      // Asynchronously measure and report the different web vitals.
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    } catch (error) {
      console.error('Error reporting web vitals:', error);
    }
  }
};

export default reportWebVitals;
