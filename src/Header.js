import React from 'react';
import './Header.css';
import { Search, ShoppingBasket } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { useStateValue } from './StateProvider';
import { auth } from './firebase';

function Header() {

    const[{basket, user}, dispatch] = useStateValue();

    const handleAuthentication = () => {
        if(user) {
            auth.signOut();
        }
    }

  return (
    <div className='header'>
        <Link to="/">
        <img 
            className='header_logo' 
            src='http://pngimg.com/uploads/amazon/amazon_PNG11.png'
            
            alt=''
         />
        </Link>
        

         <div className='header_search'>
                <input 
                 className='header_searchInput'
                    type='text'
                />
                <Search className='header_searchIcon'/>
                {/*Logo */}
         </div>

         <div className='header_nav'>
            <Link to={!user && '/login'}>
                <div onClick={handleAuthentication} className='header__option'>
                    <span className='header__optionLineOne'>Hello {!user ? 'Guest': user.email}</span>
                    <span className='header__optionLineTwo'>{user?'Sign Out':'Sign In'}</span>
                </div>
            </Link>
          

            <div className='header__option'>
                <span className='header__optionLineOne'>Returns</span>
                <span className='header__optionLineTwo'>& Orders</span>
            </div>

            <div className='header__option'>
                <span className='header__optionLineOne'>Your</span>
                <span className='header__optionLineTwo'>Prime</span>
            </div>

            <Link to="/checkout">
            <div className='header__optionBasket'>
                <ShoppingBasket/>
                <span className='header__optionLineTwo header__basketCount'>{basket?.length}</span>
            </div>
            </Link>
           
         </div>
    </div>
  )
}

export default Header