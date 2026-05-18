import { useState, useCallback } from 'react';
import type { SelectedService, ServiceType, } from '../types';
import styles from '../styles/ServiceCalculator.module.css';
import priceData from '../../price.json';
import ServiceSection from './ServiceSection';
import ServiceItem from './ServiceItem.tsx';

export default function ServiceCalculator() {
  const [selectedServices, setSelectedServices] = useState<
    Map<string, SelectedService>
  >(new Map());
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set(priceData.services.map((_, index) => index.toString())),
  );

  const toggleSection = useCallback((sectionIndex: string) => {
    setExpandedSections((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(sectionIndex)) {
        newSet.delete(sectionIndex);
      } else {
        newSet.add(sectionIndex);
      }
      return newSet;
    });
  }, []);

  const addService = useCallback(
    (serviceItem: ServiceType) => {
      setSelectedServices((prev) => {
        const newMap = new Map(prev);
        if (newMap.has(serviceItem.code)) {
          const service = newMap.get(serviceItem.code)!;
          service.quantity += 1;
          service.total = service.quantity * service.price;
        } else {
          const quantity = serviceItem.defaultQty && serviceItem.defaultQty !== 0 ? serviceItem.defaultQty : 1;

          newMap.set(serviceItem.code, {
            ...serviceItem,
            quantity,
            total: quantity * serviceItem.price,
          });
        }
        return newMap;
      });
    },
    [],
  );

  const incrementService = useCallback((code: string) => {
    setSelectedServices((prev) => {
      const newMap = new Map(prev);

      if (newMap.has(code)) {
        const service = newMap.get(code)!;

        const updatedService = {
          ...service,
          quantity: service.quantity + 1,
          total: (service.quantity + 1) * service.price,
        };

        newMap.set(code, updatedService);
      }

      return newMap;
    });
  }, []);

  const decrementService = useCallback((code: string) => {
    setSelectedServices((prev) => {
      const newMap = new Map(prev);

      if (newMap.has(code)) {
        const service = newMap.get(code)!;

        if (service.quantity > 1) {
          const updatedService = {
            ...service,
            quantity: service.quantity - 1,
            total: (service.quantity - 1) * service.price,
          };

          newMap.set(code, updatedService);
        } else {
          newMap.delete(code);
        }
      }

      return newMap;
    });
  }, []);

  const removeService = useCallback((code: string) => {
    setSelectedServices((prev) => {
      if (!prev.has(code)) return prev;

      const newMap = new Map(prev);
      newMap.delete(code);
      return newMap;
    });
  }, []);

  const totalPrice = Array.from(selectedServices.values()).reduce(
    (sum, service) => sum + service.total,
    0,
  );

  return (
    <div className={styles['calculator-container']}>
      <div className={styles['calculator-content']}>
        <div className={styles['services-list']}>
          <h1>Калькулятор цін на послуги центру догляду вдома на місяць</h1>
          {priceData.services.map((sectionData: any, index) => (
            <ServiceSection
              key={index}
              sectionIndex={index.toString()}
              section={sectionData}
              isExpanded={expandedSections.has(index.toString())}
              onToggleExpand={toggleSection}
              selectedServices={selectedServices}
              onAddService={addService}
              onIncrementService={incrementService}
              onDecrementService={decrementService}
              onRemoveService={removeService}
            />
          ))}
        </div>

        {selectedServices.size !== 0 && (
          <div className={styles['totals-section']}>
            <h2>Вибрані послуги</h2>
            <>
              <div className={styles['selected-services-list']}>
                {Array.from(selectedServices.values()).map((service) => (
                  <ServiceItem
                    key={`${service.code}`}
                    item={service}
                    itemCode={service.code}
                    selectedServices={selectedServices}
                    onAddService={() => {
                    }}
                    onIncrementService={incrementService}
                    onDecrementService={decrementService}
                    onRemoveService={removeService}
                    totalMode={true}
                  />
                ))}
              </div>

              <div className={styles['totals']}>
                <div
                  className={`${styles['total-row']} ${styles['total-price-row']}`}
                >
                  <span className={styles.totalPriceText}>Загальна вартість:</span>
                  <span
                    className={`${styles['total-value']} ${styles['total-price']}`}
                  >
                    {totalPrice} грн
                  </span>
                </div>
              </div>
            </>
          </div>)}
      </div>
    </div>
  );
}
