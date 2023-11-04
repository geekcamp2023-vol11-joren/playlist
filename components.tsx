export const PostMovie = (props: { roomId: string }) => (
  <div>
    <h1>動画投稿</h1>
    {/* TODO: apiがわかり次第変更 */}
    <form method="post" action={`/api/rooms/${props.roomId}/movies`}>
      <input type="text" name="url" />
      <button type="submit">投稿</button>
    </form>
  </div>
);
