import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { debounce } from 'lodash';

interface UseTableHeightOptions {
  headerHeight?: number;
  padding?: number;
}

export const useTableHeight = ({ headerHeight: initialHeaderHeight = 0, padding = 0 }: UseTableHeightOptions = {}) => {
  const [tableHeight, setTableHeight] = useState(0);
  const [footerHeight, setFooterHeight] = useState(0);
  const [headerHeight, setHeaderHeight] = useState(initialHeaderHeight);
  const tableHeaderRef = useRef<HTMLDivElement>(null);
  const headerHeightRef = useRef(0);

  const debouncedUpdateFooterHeight = useCallback(
    debounce(() => {
      const footerElement = document.getElementById('enhanced-table-pagination');

      if (footerElement) {
        const height = footerElement.offsetHeight;
        if (height > 0 && height !== footerHeight) {
          setFooterHeight(height);
        }
      }
    }, 100),
    [footerHeight]
  );

  useEffect(() => {
    debouncedUpdateFooterHeight();

    const observer = new MutationObserver(() => {
      debouncedUpdateFooterHeight();
    });

    const footerElement = document.getElementById('enhanced-table-pagination');

    if (footerElement) {
      observer.observe(footerElement, { attributes: true, childList: true, subtree: true, characterData: true });
    }

    return () => {
      observer.disconnect();
      debouncedUpdateFooterHeight.cancel();
    };
  }, [debouncedUpdateFooterHeight]);

  // Update header height when the table header is rendered
  useLayoutEffect(() => {
    const updateHeaderHeight = () => {
      if (tableHeaderRef.current) {
        const height = tableHeaderRef.current.offsetHeight;
        if (height > 0 && height !== headerHeightRef.current) {
          headerHeightRef.current = height;
          setHeaderHeight(height);
        }
      }
    };

    const debouncedUpdateHeaderHeight = debounce(updateHeaderHeight, 100);

    // Initial update
    updateHeaderHeight();

    // Set up observer for header changes
    const observer = new MutationObserver(debouncedUpdateHeaderHeight);

    if (tableHeaderRef.current) {
      observer.observe(tableHeaderRef.current, { attributes: true, childList: true, subtree: true, characterData: true });
    }

    return () => {
      observer.disconnect();
      debouncedUpdateHeaderHeight.cancel();
    };
  }, []);

  useLayoutEffect(() => {
    const updateHeight = () => {
      const height = window.innerHeight - headerHeight - footerHeight - padding - 150;
      const newHeight = Math.max(0, height);
      setTableHeight(newHeight);
    };

    const debouncedUpdateHeight = debounce(updateHeight, 100);

    updateHeight();

    const handleResize = () => {
      debouncedUpdateHeight();
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      debouncedUpdateHeight.cancel();
    };
  }, [headerHeight, footerHeight, padding]);

  return { tableHeight, tableHeaderRef };
};
