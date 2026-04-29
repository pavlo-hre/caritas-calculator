import { useState, useCallback } from "react";
import type { SelectedService } from "../types";
import styles from "../styles/ServiceCalculator.module.css";
import priceData from "../../price.json";
import ServiceSection from "./ServiceSection";

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
    (code: string, name: string, price: number, defaultQty?: number) => {
      setSelectedServices((prev) => {
        const newMap = new Map(prev);
        if (newMap.has(code)) {
          const service = newMap.get(code)!;
          service.quantity += 1;
          service.total = service.quantity * service.price;
        } else {
          const quantity = defaultQty && defaultQty !== 0 ? defaultQty : 1;

          newMap.set(code, {
            code,
            name,
            price,
            quantity,
            total: quantity * price,
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
  const totalTime = Array.from(selectedServices.values()).reduce(
    (sum, service) => {
      const originalService = findOriginalService(service.code);
      return sum + (originalService?.time || 0) * service.quantity;
    },
    0,
  );

  function findOriginalService(code: string) {
    for (const section of priceData.services) {
      for (const item of section.items) {
        if (item.code === code) return item;
        if (item.subItems) {
          for (const subItem of item.subItems) {
            if (subItem.code === code) return subItem;
          }
        }
      }
    }
    return null;
  }

  return (
    <div className={styles["calculator-container"]}>
      <div className={styles["calculator-content"]}>
        <div className={styles["services-list"]}>
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

        <div className={styles["totals-section"]}>
          <h2>Вибрані послуги</h2>
          {selectedServices.size === 0 ? (
            <p className={styles["no-services"]}>Немає вибраних послуг</p>
          ) : (
            <>
              <div className={styles["selected-services-list"]}>
                {Array.from(selectedServices.values()).map((service) => (
                  <div
                    key={service.code}
                    className={styles["selected-service-item"]}
                  >
                    <div className={styles["service-info"]}>
                      <p className={styles["service-name"]}>{service.name}</p>
                      <p className={styles["service-price"]}>
                        {service.price} грн
                      </p>
                    </div>
                    <div className={styles["quantity-controls"]}>
                      <button
                        className={styles["btn-quantity"]}
                        onClick={() => decrementService(service.code)}
                        title="Зменшити на 1"
                      >
                        −
                      </button>
                      <span className={styles["quantity"]}>
                        {service.quantity}
                      </span>
                      <button
                        className={styles["btn-quantity"]}
                        onClick={() => incrementService(service.code)}
                        title="Збільшити на 1"
                      >
                        +
                      </button>
                    </div>
                    <div className={styles["service-total"]}>
                      <p>{service.total} грн</p>
                      <button
                        className={styles["btn-remove"]}
                        onClick={() => removeService(service.code)}
                        title="Видалити"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className={styles["totals"]}>
                <div className={styles["total-row"]}>
                  <span>Загальний час:</span>
                  <span className={styles["total-value"]}>{totalTime} хв</span>
                </div>
                <div
                  className={`${styles["total-row"]} ${styles["total-price-row"]}`}
                >
                  <span>Загальна вартість:</span>
                  <span
                    className={`${styles["total-value"]} ${styles["total-price"]}`}
                  >
                    {totalPrice} грн
                  </span>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
