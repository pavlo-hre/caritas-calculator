import type { FC } from 'react';
import type { SelectedService, ServiceType } from '../types';
import styles from '../styles/ServiceCalculator.module.css';
import CheckIcon from './icons/CheckIcon.tsx';
import { ClockIcon } from './icons/ClockIcon.tsx';
import { CloseIcon } from './icons/CloseIcon.tsx';
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

  const hasSubItems = item.subItems && item.subItems.length > 0;
  const groupHeadingId = `service-group-${item.code}`;

  return (
    <li className={clsx(styles['service-item-container'], totalMode && styles['service-item-container-total'])}>
      {hasSubItems ? (
        // Parent item with sub-items
        <div className={styles['parent-service']}>
          <h3 id={groupHeadingId} className={styles['parent-name']}>{item.code} {item.name}</h3>
          <ul className={styles['sub-items']} aria-labelledby={groupHeadingId}>
            {item.subItems!.map((subItem: ServiceType) => (
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
          </ul>
        </div>
      ) : (
        // Single service item
        <article
          onClick={handleAdd}
          className={`${styles['service-item']} ${isSelected && !totalMode ? styles['selected'] : ''}`}
          aria-label={`${item.code} ${item.name}`}
        >
          <div className={styles['service-details']}>
            <div className={styles['service-main']}>
              {totalMode ? null : <div className={styles.iconWrap}>
                {isSelected ? (
                  <button type="button" onClick={handleRemove} aria-label={`Прибрати: ${item.name}`} title="Прибрати">
                    <CheckIcon/>
                  </button>
                ) : <div style={{width: 21}} aria-hidden="true"/>}
              </div>}
              <p className={styles['service-code']}>{item.code}</p>
              <p className={styles['service-name']}>{item.name}</p>
            </div>
          </div>

          <p className={clsx(styles.priceTime, totalMode && styles.priceTimeTotal)}>
            <span className={styles['service-price']}>
              <data value={item.price}>{item.price}</data> грн<span aria-hidden="true"> / </span>
            </span>
            <span className={styles['service-time']}>
              <ClockIcon />
              <time dateTime={`PT${item.time}M`}>{item.time} хв</time>
            </span>
          </p>

          {isSelected && selectedService ? (
            <div className={styles.controlBox}>
              <div className={styles['item-controls']} role="group" aria-label={`Кількість: ${item.name}`}>
                <button
                  type="button"
                  className={styles['btn-small']}
                  onClick={selectedService.quantity === 1 ? handleRemove : handleDecrement}
                  title="Зменшити"
                  aria-label="Зменшити кількість"
                >
                  <span aria-hidden="true">−</span>
                </button>
                <output className={styles['qty-small']} aria-live="polite">
                  {selectedService.quantity}
                </output>
                <button
                  type="button"
                  className={styles['btn-small']}
                  onClick={handleIncrement}
                  title="Збільшити"
                  aria-label="Збільшити кількість"
                >
                  <span aria-hidden="true">+</span>
                </button>

                {totalMode && <div className={styles.removeBtnWrap}>
                  <output className={styles.totalByRow}>{item.price * (selectedService?.quantity ?? 1)} грн</output>
                  <button type="button" className={styles.removeBtn} onClick={handleRemove} title="Видалити" aria-label={`Видалити: ${item.name}`}>
                    <CloseIcon />
                  </button>
                </div>}
              </div>
            </div>
          ) : (
            <button type="button" onClick={handleAdd} className={styles['btn-primary']} aria-label={`Додати: ${item.name}`}>
              Додати
            </button>
          )}
        </article>
      )}
    </li>
  );
};

export default ServiceItem;
