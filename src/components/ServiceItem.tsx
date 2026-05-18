import type { FC } from 'react';
import type { SelectedService, ServiceType } from '../types';
import styles from '../styles/ServiceCalculator.module.css';
import CheckIcon from './icons/CheckIcon.tsx';
import clsx from 'clsx';

interface ServiceItemProps {
  totalMode?: boolean;
  item: ServiceType;
  itemCode: string;
  selectedServices: Map<string, SelectedService>;
  onIncrementService: (code: string) => void;
  onDecrementService: (code: string) => void;
  onRemoveService: (code: string) => void;
  onAddService: (
    serviceItem: ServiceType
  ) => void;
}

const ServiceItem: FC<ServiceItemProps> = ({
                                             item,
                                             itemCode,
                                             selectedServices,
                                             onIncrementService,
                                             onDecrementService,
                                             onRemoveService,
                                             onAddService,
                                             totalMode,
                                           }) => {
  const isSelected = selectedServices.has(itemCode);
  const selectedService = selectedServices.get(itemCode);

  const handleIncrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onIncrementService(itemCode);
  };

  const handleDecrement = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onDecrementService(itemCode);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onRemoveService(itemCode);
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onAddService(item);
  }

  return (
    <div className={clsx(styles['service-item-container'], totalMode && styles['service-item-container-total'])}>
      {item.subItems && item.subItems.length > 0 ? (
        // Parent item with sub-items
        <div className={styles['parent-service']}>
          <div className={styles['parent-name']}>{item.code} {item.name}</div>
          <div className={styles['sub-items']}>
            {item.subItems.map((subItem: ServiceType) => (
              <ServiceItem
                key={subItem.code}
                item={subItem}
                itemCode={subItem.code}
                selectedServices={selectedServices}
                onIncrementService={onIncrementService}
                onDecrementService={onDecrementService}
                onRemoveService={onRemoveService}
                onAddService={onAddService}
              />
            ))}
          </div>
        </div>
      ) : (
        // Single service item
        <div
          onClick={handleAdd}
          className={`${styles['service-item']} ${isSelected && !totalMode ? styles['selected'] : ''}`}
        >
          <div className={styles['service-details']}>
            <div className={styles['service-main']}>
              {totalMode ? null : <div className={styles.iconWrap}>
                {isSelected ? <div onClick={handleRemove}>
                  <CheckIcon/>
                </div> : <div style={{width: 21}}/>}
              </div>}
              <p className={styles['service-code']}>{item.code}</p>
              <p className={styles['service-name']}>{item.name}</p>
            </div>
          </div>

          <div className={clsx(styles.priceTime, totalMode && styles.priceTimeTotal)}>
            <p className={styles['service-price']}>{item.price} грн / </p>
            <p className={styles['service-time']}>&nbsp;{item.time} хв 🕒 </p>
          </div>

          {isSelected && selectedService ? (
            <div className={styles.controlBox}>
              <div className={styles['item-controls']} role="controls">
                <button
                  className={styles['btn-small']}
                  onClick={selectedService.quantity === 1 ? handleRemove : handleDecrement}
                  title="Зменшити"
                >
                  -
                </button>
                <span className={styles['qty-small']}>
                {selectedService.quantity}
              </span>
                <button
                  className={styles['btn-small']}
                  onClick={handleIncrement}
                  title="Збільшити"
                >
                  +
                </button>

                {totalMode && <div className={styles.removeBtnWrap}>
                    <div className={styles.totalByRow}>{item.price * (selectedService?.quantity ?? 1)} грн</div>
                  <div className={styles.removeBtn} onClick={handleRemove}>❌</div>
                </div>}
              </div>

            </div>
          ) : <button onClick={handleAdd} className={styles['btn-primary']}>Додати</button>}
          <div>

          </div>
        </div>
      )}
    </div>
  );
};

export default ServiceItem;
