export default ({username, password, errorMessage, onChange, onSubmit}) => {

  return (
    <form onSubmit={onSubmit}>
      <div>
        <label>Username</label>
        <input type='text' name='username' onChange={onChange} />
      </div>
      <div>
        <label>Password</label>
        <input type='password' name='password' onChange={onChange} />
      </div>
      <div>
        <button>Submit</button>
      </div>
      <small style={{color: 'red'}}>{errorMessage}</small>
    </form>
  )
}