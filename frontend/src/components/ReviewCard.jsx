function ReviewCard({ review }) {
  return (
    <div className="bg-white rounded-[20px] px-7 py-[26px] shadow-[0_18px_34px_-28px_rgba(36,21,18,.3)]">
      <div className="flex justify-between items-center mb-3.5">
        <span className="font-semibold text-[15px]">{review.name}</span>
        <span className="text-brick text-[13px]">{'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</span>
      </div>
      <p className="text-muted text-sm leading-[1.6] m-0">{review.comment}</p>
    </div>
  );
}

export default ReviewCard;
