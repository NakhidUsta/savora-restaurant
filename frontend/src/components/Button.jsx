import { Link } from 'react-router-dom';

const variants = {
  primary: 'bg-maroon text-white',
  outline: 'border-[1.5px] border-ink text-ink',
  ghost: 'border-[1.5px] border-ink/25 text-ink',
};

function Button({ to, href, variant = 'primary', className = '', children, ...props }) {
  const classes = `inline-flex items-center justify-center px-[26px] py-3 rounded-full font-semibold text-[14.5px] transition-transform duration-150 hover:-translate-y-px ${variants[variant]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classes} {...props}>
        {children}
      </Link>
    );
  }
  if (href) {
    return (
      <a href={href} className={classes} {...props}>
        {children}
      </a>
    );
  }
  return (
    <button type="button" className={classes} {...props}>
      {children}
    </button>
  );
}

export default Button;
