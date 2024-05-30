const PlaceList = () => {
    return (
        <BasicLayout>
            <div className="text-3xl">
                <div>마이페이지</div>
            </div>
            <MyProfileComponent user_id={user_id}></MyProfileComponent>
            <MyStudyComponent/>
            <MyFavoritesComponent/>
            <MyPostComponent/>
        </BasicLayout>       
    )
}