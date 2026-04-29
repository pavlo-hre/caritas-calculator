import type { FC } from 'react';
import type { ServiceItem as ServiceItemType, SelectedService } from '../types';
import styles from '../styles/ServiceCalculator.module.css';
import CheckIcon from './icons/CheckIcon.tsx';

interface ServiceItemProps {
  item: ServiceItemType;
  itemCode: string;
  selectedServices: Map<string, SelectedService>;
  onIncrementService: (code: string) => void;
  onDecrementService: (code: string) => void;
  onRemoveService: (code: string) => void;
  onAddService: (code: string, name: string, price: number, defaultQty?: number) => void;
}

const ServiceItem: FC<ServiceItemProps> = ({
                                             item,
                                             itemCode,
                                             selectedServices,
                                             onIncrementService,
                                             onDecrementService,
                                             onRemoveService,
                                             onAddService,
                                           }) => {
  const isSelected = selectedServices.has(itemCode);
  const selectedService = selectedServices.get(itemCode);

  const handleIncrement = (e: React.MouseEvent) => {
    console.log('increment')
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
    onAddService(item.code, item.name, item.price, item.defaultQty);
  }

  return (
    <div className={styles['service-item-container']}>
      {item.subItems && item.subItems.length > 0 ? (
        // Parent item with sub-items
        <div className={styles['parent-service']}>
          <div className={styles['parent-name']}>{item.code} {item.name}</div>
          <div className={styles['sub-items']}>
            {item.subItems.map((subItem) => (
              <SubServiceItem
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
          className={`${styles['service-item']} ${isSelected ? styles['selected'] : ''}`}
        >
          <div className={styles['service-details']}>
            <div className={styles['service-main']}>
              <div className={styles.iconWrap}>
                {isSelected ? <div onClick={handleRemove}>
                  <CheckIcon/>
                </div> :  <div style={{width: 21}}/>}
              </div>
              <p className={styles['service-code']}>{item.code}</p>
              <p className={styles['service-name']}>{item.name}</p>
            </div>
            {item.time && (
              <p className={styles['service-time']}>{item.time} хв</p>
            )}
          </div>
          <p className={styles['service-price']}>{item.price} грн</p>
          {isSelected && selectedService ? (
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
            </div>
          ) : <button onClick={handleAdd} className={styles['btn-primary']}>Додати</button>}
        </div>
      )}
    </div>
  );
};

interface SubServiceItemProps {
  item: ServiceItemType;
  itemCode: string;
  selectedServices: Map<string, SelectedService>;
  onIncrementService: (code: string) => void;
  onDecrementService: (code: string) => void;
  onRemoveService: (code: string) => void;
  onAddService: (code: string, name: string, price: number, defaultQty?: number) => void;
}

const SubServiceItem: FC<SubServiceItemProps> = ({
                                                   item,
                                                   itemCode,
                                                   selectedServices,
                                                   onIncrementService,
                                                   onDecrementService,
                                                   onRemoveService,
                                                   onAddService,
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
    onAddService(item.code, item.name, item.price, item.defaultQty);
  }

  return (
    <div
      onClick={handleAdd}
      className={`${styles['sub-service-item']} ${isSelected ? styles['selected'] : ''}`}
    >
      <div className={styles['sub-service-details']}>
        <div className={styles['service-main']}>
          <div className={styles.iconWrap}>
            {isSelected ? <div onClick={handleRemove}>
              <CheckIcon/>
            </div> : <div style={{width: 21}}/>}
          </div>
          <p className={styles['service-code']}>{item.code}</p>
          <p className={styles['sub-service-name']}>{item.name}</p>
        </div>
        {item.time && (
          <p className={styles['sub-service-time']}>{item.time} хв</p>
        )}
      </div>
      <p className={styles['sub-service-price']}>{item.price} грн</p>
      {isSelected && selectedService ? (
        <div className={styles['sub-service-controls']} role="controls">
          <button
            className={styles['btn-small']}
            onClick={
              selectedService.quantity === 1 ? handleRemove : handleDecrement
            }
            title={selectedService.quantity === 1 ? 'Видалити' : 'Зменшити'}
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
        </div>
      ): <button onClick={handleAdd} className={styles['btn-primary']}>Додати</button>}
    </div>
  );
};

export default ServiceItem;
