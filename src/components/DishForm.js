import React, { useState } from 'react'
import { Form, Field } from 'react-final-form'

const DishForm = () => {
  const [isPizza, setIsPizza] = useState(true)
  const [isSoup, setIsSoup] = useState(false)
  const [isSandwich, setIsSandwich] = useState(false)

  const onSubmit = (values) => {
    fetch('https://frosty-wood-6558.getsandbox.com:443/dishes', {
      method: 'post',
      body: JSON.stringify(values),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  const validate = (values) => {
    if (values.selectDish === 'pizza') {
      setIsPizza(true)
      setIsSoup(false)
      setIsSandwich(false)
      values.spiciness_scale = ''
      values.sandwichSlices = ''
    } else if (values.selectDish === 'soup') {
      setIsPizza(false)
      setIsSoup(true)
      setIsSandwich(false)
      values.no_of_slices = ''
      values.diameter = ''
      values.sandwichSlices = ''
    } else if (values.selectDish === 'sandwich') {
      setIsPizza(false)
      setIsSoup(false)
      setIsSandwich(true)
      values.no_of_slices = ''
      values.diameter = ''
      values.spiciness_scale = ''
    }
  }

  const required = value => (value ? undefined : 'Required')
  const minNumber = min => value => isNaN(value) || value >= min ? undefined : `Must be more than ${min}`
  const maxNumber = max => value => isNaN(value) || value <= max ? undefined : `Must be less than ${max}`
  const composeValidators = (...validators) => value =>
    validators.reduce((error, validator) => error || validator(value), undefined)

  return (
    <div className='dish-form'>
      <h1>Choose your dish</h1>
      <div className='form-container'>
        <Form
          onSubmit={onSubmit}
          validate={values => validate(values)}
          initialValues={{ selectDish: "pizza" }}
          render={({ handleSubmit, submitting }) => (
            <form onSubmit={handleSubmit}>
              <Field name='name' validate={required}>
                {({ input, meta }) => (
                  <div className='form'>
                    <label>Name:</label>
                    <input {...input} type="text" placeholder="Dish name" />
                    {meta.error && meta.touched && <div className='error'>{meta.error}</div>}
                  </div>
                )}
              </Field>
              <Field name='preparationTime' validate={required}>
                {({ input, meta }) => (
                  <div className='form'>
                    <label>Preparation time:</label>
                    <input type="time" step='1' {...input} />
                    {meta.error && meta.touched && <div className='error'>{meta.error}</div>}
                  </div>
                )}
              </Field>
              <div className='form'>
                <label>Dish type:</label>
                <Field component="select" name="selectDish" >
                  <option value="pizza">Pizza</option>
                  <option value="soup">Soup</option>
                  <option value="sandwich">Sandwich</option>
                </Field>
              </div>

              {isPizza ?
                <div className='pizza-select'>
                  <Field name='no_of_slices' validate={composeValidators(required, minNumber(2), maxNumber(8))} >
                    {({ input, meta }) => (
                      <div>
                        <label>Number of Slices:</label>
                        <input type="number" {...input} />
                        {meta.error && meta.touched && <div className='error'>{meta.error}</div>}
                      </div>
                    )}
                  </Field>
                  <Field name='diameter' validate={composeValidators(required, minNumber(20), maxNumber(50))}>
                    {({ input, meta }) => (
                      <div className='form'>
                        <label>Diameter</label>
                        <input type="number" {...input} />
                        {meta.error && meta.touched && <div className='error'>{meta.error}</div>}
                      </div>
                    )}

                  </Field>
                </div>
                : ''}

              {isSoup &&
                <div className='soup-select'>
                  <label>Spiciness scale:</label>
                  <Field component='select' name='spiciness_scale'>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3</option>
                    <option value="4">4</option>
                    <option value="5">5</option>
                    <option value="6">6</option>
                    <option value="7">7</option>
                    <option value="8">8</option>
                    <option value="9">9</option>
                    <option value="10">10</option>
                  </Field>
                </div>}
              {isSandwich &&
                <Field name='sandwichSlices' validate={composeValidators(required, minNumber(2), maxNumber(6))} >
                  {({ input, meta }) => (
                    <div className='sandwich-select'>
                      <label>Slices of bread</label>
                      <input type="number" {...input} />
                      {meta.error && meta.touched && <div className='error'>{meta.error}</div>}
                    </div>
                  )}
                </Field>
              }
              <button type='submit' disabled={submitting}>Confirm</button>
            </form>
          )}
        >
        </Form>
      </div>
    </div >
  )
}

export default DishForm
