import { Link } from 'react-router-dom';
import { resolveUploadUrl } from '../api/upload';

function MenuCard({ item, linkTo, linkLabel = 'Sifariş et →', priceSuffix = '', onAction, actionLabel }) {
  return (
    <div className="bg-white rounded-[20px] overflow-hidden shadow-[0_18px_34px_-26px_rgba(36,21,18,.35)]">
      <img
        src={resolveUploadUrl(item.image_url)}
        alt={item.name}
        loading="lazy"
        className="h-[150px] w-full object-cover"
      />
      <div className="px-5 pt-[18px] pb-[22px]">
        <div className="text-[12.5px] text-brick font-bold mb-1.5">
          {Number(item.price)} ₼{priceSuffix}
        </div>
        <h3 className="text-[17px] font-semibold mb-1.5">{item.name}</h3>
        <p className="text-[13px] text-muted mb-3.5 leading-relaxed">{item.description}</p>
        {onAction ? (
          <button type="button" onClick={onAction} className="text-[13.5px] font-semibold text-maroon">
            {actionLabel || linkLabel}
          </button>
        ) : (
          <Link to={linkTo} className="text-[13.5px] font-semibold text-maroon">
            {linkLabel}
          </Link>
        )}
      </div>
    </div>
  );
}

export default MenuCard;
